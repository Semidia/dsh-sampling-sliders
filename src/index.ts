// dsh-sampling-sliders — Host half (out-of-tree plugin)
//
// Registers a `sampling-sliders` settings namespace and intercepts
// `agent/request` to inject temperature / maxTokens into every model call
// for ALL providers.
//
// Mode semantics:
//   - mode: 'persist' — values written to settings survive restarts.
//   - mode: 'hot'     — values apply live for the current run; at the next
//     boot the host clears them (hot = ephemeral across restarts).
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

export const name = 'sampling-sliders'

// Hard dependency on the settings service: without this the plugin activates
// before `ctx.settings` is provided, `register()` is skipped, and clients get
// "settings namespace not registered" on every write.
export const inject = ['settings']

const Config = z.object({
  mode: z.string(),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().step(1).min(1),
})

export function apply(ctx: Context, config: Record<string, unknown> = {}) {
  const settings: any = ctx.get('settings')
  let scope: any = null
  if (settings && typeof settings.register === 'function') {
    scope = settings.register('sampling-sliders', Config, { applies: 'live', base: config })
  }

  // Boot-clear: leftover 'hot' values from a previous run apply for that run
  // only. On startup, reset them so they do not silently re-apply.
  if (scope && typeof scope.replace === 'function' && typeof scope.get === 'function') {
    try {
      const current = scope.get()
      if (current && current.mode === 'hot') {
        scope.replace({ mode: 'persist' }).catch(() => {})
      }
    } catch {
      // no stored section yet — nothing to clear
    }
  }

  const read = (): any => {
    if (scope && typeof scope.get === 'function') return scope.get()
    return config
  }

  // `agent/request` is a waterfall around the frozen call config.
  ;(ctx as any).on('agent/request', async (payload: any, next: () => Promise<any>) => {
    const c = await next()
    if (!c || typeof c !== 'object') return c
    const v = read()
    if (!v || typeof v !== 'object') return c
    const out: any = { ...c }
    if (typeof v.temperature === 'number') out.temperature = v.temperature
    if (typeof v.maxTokens === 'number') out.maxTokens = v.maxTokens
    return out
  })

  if (scope) {
    console.log('[sampling-sliders] settings namespace registered + agent/request interceptor active')
  } else {
    console.warn('[sampling-sliders] WARNING: settings service unavailable — namespace NOT registered; only row config applies')
  }
}
