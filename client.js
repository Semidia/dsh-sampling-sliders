// dsh-sampling-sliders — Client half (dynamic Cordis Plugin)
//
// Renders a compact "采样" button in the composer tool row, immediately next
// to the model selector (slot `conversation.input.right`). Clicking it opens
// a popover with temperature / maxTokens sliders, a hot/persist mode toggle,
// and apply / reset actions. Plain React (React.createElement, no JSX).

return {
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    styles.insert(`
      .dsp-anchor{position:relative;display:inline-flex;align-items:center}
      .dsp-trigger{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:999px;padding:4px 11px;font-size:12px;line-height:20px;cursor:pointer;white-space:nowrap}
      .dsp-trigger:hover{border-color:var(--dsw-alias-brand-primary)}
      .dsp-trigger.has-override{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}
      .dsp-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-brand-primary);flex:0 0 auto}
      .dsp-backdrop{position:fixed;inset:0;z-index:9990;background:transparent}
      .dsp-pop{position:absolute;bottom:calc(100% + 10px);right:0;z-index:9991;width:300px;max-width:calc(100vw - 24px);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;color:var(--dsw-alias-label-primary);font-size:12px;line-height:1.5;box-shadow:0 10px 34px rgba(0,0,0,.28)}
      .dsp-pop-title{font-size:13px;font-weight:600}
      .dsp-pop-sub{opacity:.72;font-size:11px}
      .dsp-mode-row{display:flex;align-items:center;gap:8px}
      .dsp-mode{display:inline-flex;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;overflow:hidden}
      .dsp-mode button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:5px 12px;cursor:pointer;font-size:12px}
      .dsp-mode button.on{background:var(--dsw-alias-brand-primary);color:#fff}
      .dsp-row{display:flex;flex-direction:column;gap:5px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:8px 10px}
      .dsp-row-head{display:flex;align-items:center;gap:8px}
      .dsp-label{font-weight:500}
      .dsp-val{margin-left:auto;opacity:.75;font-variant-numeric:tabular-nums}
      .dsp-check{display:flex;align-items:center;gap:4px;font-size:11px;opacity:.85;cursor:pointer}
      .dsp-row input[type=range]{width:100%;accent-color:var(--dsw-alias-brand-primary)}
      .dsp-row input[type=range]:disabled{opacity:.35}
      .dsp-actions{display:flex;gap:8px}
      .dsp-actions button{flex:1;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px}
      .dsp-actions button.primary{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}
      .dsp-status{min-height:16px;font-size:11px;opacity:.85;white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-secondary)}
    `)

    function Control() {
      const [open, setOpen] = React.useState(false)
      const [mode, setMode] = React.useState('hot')
      const [temperature, setTemperature] = React.useState(1.0)
      const [overrideTemp, setOverrideTemp] = React.useState(false)
      const [maxTokens, setMaxTokens] = React.useState(4096)
      const [overrideMax, setOverrideMax] = React.useState(false)
      const [status, setStatus] = React.useState('')
      const [loaded, setLoaded] = React.useState(false)

      React.useEffect(() => {
        let alive = true
        host.call('get-state').then((s) => {
          if (!alive) return
          if (s && typeof s === 'object') {
            setMode(s.mode === 'persist' ? 'persist' : 'hot')
            if (typeof s.temperature === 'number') { setTemperature(s.temperature); setOverrideTemp(true) }
            if (typeof s.maxTokens === 'number') { setMaxTokens(s.maxTokens); setOverrideMax(true) }
          }
          setLoaded(true)
        }).catch(() => { setLoaded(true) })
        return () => { alive = false }
      }, [])

      const apply = () => {
        setStatus('处理中…')
        host.call('apply', {
          mode,
          temperature: overrideTemp ? temperature : null,
          maxTokens: overrideMax ? maxTokens : null,
        }).then((r) => {
          if (r && r.ok) {
            if (r.mode === 'persist') setStatus('已持久化并热调 ✓\n' + (r.filePath || ''))
            else setStatus('已热调 ✓ 下次调用生效')
          } else {
            setStatus('失败：' + ((r && r.error) || '未知错误'))
          }
        }).catch((e) => setStatus('失败：' + String((e && e.message) || e)))
      }

      const reset = () => {
        host.call('reset').then(() => {
          setOverrideTemp(false)
          setOverrideMax(false)
          setStatus('已恢复默认（跟随模型默认值）')
        }).catch((e) => setStatus('失败：' + String((e && e.message) || e)))
      }

      const fmt = (n) => Number(n).toFixed(2)
      const anyOverride = overrideTemp || overrideMax

      return React.createElement('div', { className: 'dsp-anchor' },
        React.createElement('button', {
          className: 'dsp-trigger' + (anyOverride ? ' has-override' : ''),
          title: '模型采样参数（temperature / maxTokens）',
          onClick: () => setOpen((v) => !v),
        },
          anyOverride ? React.createElement('span', { className: 'dsp-dot' }) : null,
          React.createElement('span', null, '采样')
        ),
        open ? React.createElement('div', { className: 'dsp-backdrop', onClick: () => setOpen(false) }) : null,
        open ? React.createElement('div', { className: 'dsp-pop' },
          React.createElement('div', { className: 'dsp-pop-title' }, '模型采样参数'),
          React.createElement('div', { className: 'dsp-pop-sub' }, '作用于所有 Provider（官方 / 第三方）的后续调用。'),
          React.createElement('div', { className: 'dsp-mode-row' },
            React.createElement('span', { className: 'dsp-label' }, '模式'),
            React.createElement('div', { className: 'dsp-mode' },
              React.createElement('button', { className: mode === 'hot' ? 'on' : '', onClick: () => setMode('hot') }, '热调'),
              React.createElement('button', { className: mode === 'persist' ? 'on' : '', onClick: () => setMode('persist') }, '持久化')
            )
          ),
          React.createElement('div', { className: 'dsp-pop-sub' },
            mode === 'hot' ? '热调：立即生效，重启后失效。' : '持久化：写入工作区 .dsh-sampling-params.json。'
          ),
          React.createElement('div', { className: 'dsp-row' },
            React.createElement('div', { className: 'dsp-row-head' },
              React.createElement('span', { className: 'dsp-label' }, 'temperature'),
              React.createElement('label', { className: 'dsp-check' },
                React.createElement('input', { type: 'checkbox', checked: overrideTemp, onChange: (e) => setOverrideTemp(e.target.checked) }),
                React.createElement('span', null, '覆盖')
              ),
              React.createElement('span', { className: 'dsp-val' }, overrideTemp ? fmt(temperature) : '默认')
            ),
            React.createElement('input', {
              type: 'range', min: '0', max: '2', step: '0.05',
              value: temperature, disabled: !overrideTemp,
              onChange: (e) => setTemperature(Number(e.target.value)),
            })
          ),
          React.createElement('div', { className: 'dsp-row' },
            React.createElement('div', { className: 'dsp-row-head' },
              React.createElement('span', { className: 'dsp-label' }, 'maxTokens'),
              React.createElement('label', { className: 'dsp-check' },
                React.createElement('input', { type: 'checkbox', checked: overrideMax, onChange: (e) => setOverrideMax(e.target.checked) }),
                React.createElement('span', null, '覆盖')
              ),
              React.createElement('span', { className: 'dsp-val' }, overrideMax ? String(maxTokens) : '默认')
            ),
            React.createElement('input', {
              type: 'range', min: '512', max: '32768', step: '256',
              value: maxTokens, disabled: !overrideMax,
              onChange: (e) => setMaxTokens(Number(e.target.value)),
            })
          ),
          React.createElement('div', { className: 'dsp-actions' },
            React.createElement('button', { className: 'primary', onClick: apply }, '应用'),
            React.createElement('button', { onClick: reset }, '恢复默认')
          ),
          React.createElement('div', { className: 'dsp-status' }, loaded ? status : '读取状态中…')
        ) : null
      )
    }

    slots.inject('conversation.input.right', () => slots.register(
      { name: 'conversation.input.right', id: 'sampling-params', order: 0 },
      () => React.createElement(Control, null),
    ))
  },
}
