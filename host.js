// dsh-sampling-sliders — Host half (dynamic Cordis Plugin)
//
// DeepSeek Harness dynamic Cordis plugin. Load via cordis_define(code.host),
// or adapt the returned Plugin object into an out-of-tree `dsh` bundle.
//
// How it works:
//   - Registers an `agent/request` waterfall listener (the sanctioned hook to
//     "replace the frozen call configuration"). It awaits `next()` for the
//     config the machine would use, then returns a replacement with the
//     user's temperature / maxTokens overrides merged in.
//   - Because `agent/request` fires before provider routing, the override
//     applies to EVERY provider (official DeepSeek and third-party routes).
//   - "persist" mode writes the values to a JSON file under the workspace
//     root and reloads them on startup.

return {
  apply(ctx) {
    const fs = ctx.get('fs')
    const sandboxPolicy = ctx.get('sandboxPolicy')

    const state = {
      mode: 'hot',
      temperature: null, // number | null — null means "follow provider default"
      maxTokens: null,
      filePath: null,
    }

    let persistPath = null
    if (sandboxPolicy && typeof sandboxPolicy.workspaceRoot === 'string') {
      const root = String(sandboxPolicy.workspaceRoot).replace(/[\\/]+$/, '')
      persistPath = root + '/.dsh-sampling-params.json'
    }

    // Restore persisted values on startup (best-effort).
    if (fs && persistPath) {
      ;(async () => {
        try {
          const target = await fs.resolve(persistPath)
          const text = await fs.readText(target)
          const data = JSON.parse(text)
          if (data && typeof data === 'object') {
            if (typeof data.temperature === 'number') state.temperature = data.temperature
            if (typeof data.maxTokens === 'number') state.maxTokens = data.maxTokens
            state.filePath = persistPath
          }
        } catch (e) {
          // no persisted file yet, or unreadable — ignore
        }
      })()
    }

    // Intercept every model request and merge the sampling overrides.
    ctx.on('agent/request', async (payload, next) => {
      const config = await next()
      if (!config || typeof config !== 'object') return config
      const out = { ...config }
      if (typeof state.temperature === 'number') out.temperature = state.temperature
      if (typeof state.maxTokens === 'number') out.maxTokens = state.maxTokens
      return out
    })

    // Client -> Host RPC.
    harness.handle('get-state', async () => ({
      mode: state.mode,
      temperature: state.temperature,
      maxTokens: state.maxTokens,
      filePath: state.filePath,
      persistPath,
    }))

    harness.handle('apply', async (args) => {
      const a = args && typeof args === 'object' ? args : {}
      let temperature = null
      let maxTokens = null
      if (typeof a.temperature === 'number' && Number.isFinite(a.temperature)) {
        temperature = Math.min(2, Math.max(0, a.temperature))
      }
      if (typeof a.maxTokens === 'number' && Number.isFinite(a.maxTokens)) {
        maxTokens = Math.max(1, Math.floor(a.maxTokens))
      }
      const mode = a.mode === 'persist' ? 'persist' : 'hot'

      state.temperature = temperature
      state.maxTokens = maxTokens
      state.mode = mode

      if (mode === 'persist') {
        if (!fs || !persistPath) {
          return { ok: false, error: 'persist unavailable: missing fs service or workspace path' }
        }
        try {
          const payload = JSON.stringify({ temperature, maxTokens }, null, 2)
          const target = await fs.resolve(persistPath)
          await fs.writeText(target, payload)
          state.filePath = persistPath
        } catch (e) {
          return { ok: false, error: 'write failed: ' + String((e && e.message) || e) }
        }
      }

      return {
        ok: true,
        mode: state.mode,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        filePath: state.filePath,
      }
    })

    harness.handle('reset', async () => {
      state.temperature = null
      state.maxTokens = null
      return { ok: true, mode: state.mode, temperature: null, maxTokens: null }
    })
  },
}
