window.__ModuleLoader__.load({
  id: "dsh-sampling-sliders",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");

    const inject = ["slots", "connection"];

    const CSS = `
      .dsp-anchor{position:relative;display:inline-flex;align-items:center}
      .dsp-trigger{border:1px solid var(--dsw-alias-border-l2);height:32px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);cursor:pointer;background:transparent;border-radius:18px;justify-content:center;align-items:center;gap:4px;padding:6px 12px;font-size:13px;font-weight:400;line-height:20px;display:inline-flex;white-space:nowrap}
      .dsp-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
      .dsp-trigger.has-override{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
      .dsp-trigger span,.dsp-trigger svg{flex:none}
      .dsp-backdrop{position:fixed;inset:0;z-index:9990;background:transparent}
      .dsp-pop{position:absolute;bottom:calc(100% + 10px);right:0;z-index:9991;width:300px;max-width:calc(100vw - 24px);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;color:var(--dsw-alias-label-primary);font-size:12px;line-height:1.5;box-shadow:0 10px 34px rgba(0,0,0,.3)}
      .dsp-pop-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .dsp-pop-head-left{display:flex;align-items:center;gap:6px;min-width:0}
      .dsp-pop-title{font-size:13px;font-weight:600;line-height:20px}
      .dsp-help{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border:1px solid var(--dsw-alias-border-l2);border-radius:50%;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1;cursor:pointer;flex:none;padding:0}
      .dsp-help:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
      .dsp-help-text{font-size:11px;line-height:1.7;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;white-space:pre-line}
      .dsp-mode{display:inline-flex;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;overflow:hidden;flex:none}
      .dsp-mode button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:3px 10px;cursor:pointer;font-size:11px;line-height:18px}
      .dsp-mode button.on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:500}
      .dsp-divider{border-top:1px solid var(--dsw-alias-border-l1)}
      .dsp-param{display:flex;flex-direction:column;gap:4px}
      .dsp-param-head{display:flex;align-items:center;gap:8px}
      .dsp-label{font-weight:500}
      .dsp-val{margin-left:auto;opacity:.75;font-variant-numeric:tabular-nums;font-size:11px}
      .dsp-check{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--dsw-alias-label-secondary);cursor:pointer}
      .dsp-check input{accent-color:var(--dsw-alias-brand-primary);width:13px;height:13px;margin:0;cursor:pointer}
      .dsp-slider{-webkit-appearance:none;appearance:none;width:100%;height:16px;margin:0;padding:0;background:transparent;cursor:pointer}
      .dsp-slider::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--dsw-alias-border-l2)}
      .dsp-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--dsw-alias-brand-primary);border:none;margin-top:-5px;cursor:pointer}
      .dsp-slider::-moz-range-track{height:4px;border-radius:2px;background:var(--dsw-alias-border-l2)}
      .dsp-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--dsw-alias-brand-primary);border:none;cursor:pointer}
      .dsp-slider:disabled{opacity:.4;cursor:default}
      .dsp-actions{display:flex;gap:8px}
      .dsp-actions button{flex:1;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px}
      .dsp-actions button:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .dsp-actions button.primary{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}
      .dsp-status{min-height:16px;font-size:11px;opacity:.8;white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-secondary)}
    `;

    function TuneIcon() {
      return React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', 'aria-hidden': true },
        React.createElement('line', { x1: 1.5, y1: 2.5, x2: 10.5, y2: 2.5, stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' }),
        React.createElement('circle', { cx: 7.5, cy: 2.5, r: 1.6, fill: 'currentColor' }),
        React.createElement('line', { x1: 1.5, y1: 6, x2: 10.5, y2: 6, stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' }),
        React.createElement('circle', { cx: 4, cy: 6, r: 1.6, fill: 'currentColor' }),
        React.createElement('line', { x1: 1.5, y1: 9.5, x2: 10.5, y2: 9.5, stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' }),
        React.createElement('circle', { cx: 8, cy: 9.5, r: 1.6, fill: 'currentColor' })
      );
    }

    function Panel(props) {
      const api = props.api;
      const [open, setOpen] = React.useState(false);
      const [mode, setMode] = React.useState('persist');
      const [temperature, setTemperature] = React.useState(1.0);
      const [overrideTemp, setOverrideTemp] = React.useState(false);
      const [maxTokens, setMaxTokens] = React.useState(4096);
      const [overrideMax, setOverrideMax] = React.useState(false);
      const [revision, setRevision] = React.useState(0);
      const [status, setStatus] = React.useState('');
      const [loaded, setLoaded] = React.useState(false);
      const [showHelp, setShowHelp] = React.useState(false);

      const load = React.useCallback(() => {
        api.settings.describe({}).then((res) => {
          if (res && res.result && res.result.ok) {
            const ns = (res.result.value.namespaces || []).find((n) => n.ns === 'sampling-sliders');
            if (ns) {
              const v = ns.value || {};
              if (v.mode === 'hot' || v.mode === 'persist') setMode(v.mode);
              if (typeof v.temperature === 'number') { setTemperature(v.temperature); setOverrideTemp(true); } else { setOverrideTemp(false); }
              if (typeof v.maxTokens === 'number') { setMaxTokens(v.maxTokens); setOverrideMax(true); } else { setOverrideMax(false); }
              setRevision(ns.revision);
            }
          }
          setLoaded(true);
        }).catch(() => setLoaded(true));
      }, [api]);

      React.useEffect(() => { load(); }, [load]);

      const apply = () => {
        setStatus('保存中…');
        const patch = { mode };
        if (overrideTemp) patch.temperature = temperature;
        if (overrideMax) patch.maxTokens = maxTokens;
        api.settings.update({ ns: 'sampling-sliders', patch, expectedRevision: revision }).then((res) => {
          if (res && res.result && res.result.ok) {
            setRevision(res.result.value.revision);
            setStatus(mode === 'persist'
              ? '已持久化 ✓ 长期生效'
              : '已热调 ✓ 本次运行生效（重启后清除）');
          } else {
            setStatus('失败：' + (res && res.result && res.result.error ? res.result.error.message : '未知错误'));
          }
        }).catch((e) => setStatus('失败：' + String((e && e.message) || e)));
      };

      const reset = () => {
        setStatus('重置中…');
        api.settings.replace({ ns: 'sampling-sliders', section: { mode: 'persist' }, expectedRevision: revision }).then((res) => {
          if (res && res.result && res.result.ok) {
            setRevision(res.result.value.revision);
            setMode('persist');
            setOverrideTemp(false);
            setOverrideMax(false);
            setStatus('已恢复默认（跟随模型默认值）');
          } else {
            setStatus('失败：' + (res && res.result && res.result.error ? res.result.error.message : '未知错误'));
          }
        }).catch((e) => setStatus('失败：' + String((e && e.message) || e)));
      };

      const fmt = (n) => Number(n).toFixed(2);
      const fmtMax = (n) => Number(n).toLocaleString();
      const anyOverride = overrideTemp || overrideMax;

      return React.createElement('div', { className: 'dsp-anchor' },
        React.createElement('button', {
          className: 'dsp-trigger' + (anyOverride ? ' has-override' : ''),
          title: '模型采样参数（temperature / maxTokens）',
          onClick: () => setOpen((v) => !v),
        },
          React.createElement('span', null, '采样'),
          React.createElement(TuneIcon, null)
        ),
        open ? React.createElement('div', { className: 'dsp-backdrop', onClick: () => setOpen(false) }) : null,
        open ? React.createElement('div', { className: 'dsp-pop' },
          React.createElement('div', { className: 'dsp-pop-head' },
            React.createElement('div', { className: 'dsp-pop-head-left' },
              React.createElement('span', { className: 'dsp-pop-title' }, '模型采样参数'),
              React.createElement('button', { className: 'dsp-help', title: '温度 / 最大输出说明', onClick: () => setShowHelp((v) => !v) }, '?')
            ),
            React.createElement('div', { className: 'dsp-mode' },
              React.createElement('button', { className: mode === 'hot' ? 'on' : '', onClick: () => setMode('hot') }, '热调'),
              React.createElement('button', { className: mode === 'persist' ? 'on' : '', onClick: () => setMode('persist') }, '持久化')
            )
          ),
          showHelp ? React.createElement('div', { className: 'dsp-help-text' }, '温度（temperature）：控制输出随机性/创造性。\n0 = 最确定保守，越大越随机、越有创意。\n· 0–0.3：编码 / 事实性任务\n· 0.7–1.0：创意写作 / 头脑风暴\n· 不勾选「覆盖」= 跟随模型默认。\n\n最大输出（maxTokens）：单次回答最多生成的 token 数，不是上下文长度（DeepSeek 上下文 1M）。') : null,
          React.createElement('div', { className: 'dsp-divider' }),
          React.createElement('div', { className: 'dsp-param' },
            React.createElement('div', { className: 'dsp-param-head' },
              React.createElement('span', { className: 'dsp-label' }, 'temperature'),
              React.createElement('label', { className: 'dsp-check' },
                React.createElement('input', { type: 'checkbox', checked: overrideTemp, onChange: (e) => setOverrideTemp(e.target.checked) }),
                React.createElement('span', null, '覆盖')
              ),
              React.createElement('span', { className: 'dsp-val' }, overrideTemp ? fmt(temperature) : '默认')
            ),
            React.createElement('input', {
              type: 'range', className: 'dsp-slider', min: '0', max: '2', step: '0.05',
              value: overrideTemp ? temperature : 1.0, disabled: !overrideTemp,
              onChange: (e) => setTemperature(Number(e.target.value)),
            })
          ),
          React.createElement('div', { className: 'dsp-param' },
            React.createElement('div', { className: 'dsp-param-head' },
              React.createElement('span', { className: 'dsp-label' }, 'maxTokens'),
              React.createElement('label', { className: 'dsp-check' },
                React.createElement('input', { type: 'checkbox', checked: overrideMax, onChange: (e) => setOverrideMax(e.target.checked) }),
                React.createElement('span', null, '覆盖')
              ),
              React.createElement('span', { className: 'dsp-val' }, overrideMax ? fmtMax(maxTokens) : '默认')
            ),
            React.createElement('input', {
              type: 'range', className: 'dsp-slider', min: '512', max: '256000', step: '1024',
              value: overrideMax ? maxTokens : 4096, disabled: !overrideMax,
              onChange: (e) => setMaxTokens(Number(e.target.value)),
            })
          ),
          React.createElement('div', { className: 'dsp-actions' },
            React.createElement('button', { className: 'primary', onClick: apply }, '应用'),
            React.createElement('button', { onClick: reset }, '恢复默认')
          ),
          React.createElement('div', { className: 'dsp-status' }, loaded ? (status || (mode === 'hot' ? '热调：本次运行生效，重启后清除。' : '持久化：写入配置，长期生效。')) : '读取状态中…')
        ) : null
      );
    }

    function apply(ctx) {
      const connection = ctx.get('connection');
      if (!connection || !connection.api) return;
      const api = connection.api;

      const tagId = 'dsh-sampling-sliders/styles';
      if (typeof document !== 'undefined' && !document.querySelector('style[data-plugin-css="' + tagId + '"]')) {
        const tag = document.createElement('style');
        tag.setAttribute('data-plugin-css', tagId);
        tag.textContent = CSS;
        document.head.appendChild(tag);
      }

      ctx.slots.inject('conversation.input.right', () => ctx.slots.register(
        { name: 'conversation.input.right', id: 'sampling-params', order: 0 },
        () => React.createElement(Panel, { api }),
      ));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
