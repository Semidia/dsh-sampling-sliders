import z from '@deepseek-ai/schemastery';
export const name = 'sampling-sliders';
// Hard dependency on the settings service: without this the plugin activates
// before `ctx.settings` is provided, `register()` is skipped, and clients get
// "settings namespace not registered" on every write.
export const inject = ['settings'];
const Config = z.object({
    mode: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().step(1).min(1),
});
export function apply(ctx, config = {}) {
    const settings = ctx.get('settings');
    let scope = null;
    if (settings && typeof settings.register === 'function') {
        scope = settings.register('sampling-sliders', Config, { applies: 'live', base: config });
    }
    // Boot-clear: leftover 'hot' values from a previous run apply for that run
    // only. On startup, reset them so they do not silently re-apply.
    if (scope && typeof scope.replace === 'function' && typeof scope.get === 'function') {
        try {
            const current = scope.get();
            if (current && current.mode === 'hot') {
                scope.replace({ mode: 'persist' }).catch(() => { });
            }
        }
        catch {
            // no stored section yet — nothing to clear
        }
    }
    const read = () => {
        if (scope && typeof scope.get === 'function')
            return scope.get();
        return config;
    };
    ctx.on('agent/request', async (payload, next) => {
        const c = await next();
        if (!c || typeof c !== 'object')
            return c;
        const v = read();
        if (!v || typeof v !== 'object')
            return c;
        const out = { ...c };
        if (typeof v.temperature === 'number')
            out.temperature = v.temperature;
        if (typeof v.maxTokens === 'number')
            out.maxTokens = v.maxTokens;
        return out;
    });
    if (scope) {
        console.log('[sampling-sliders] settings namespace registered + agent/request interceptor active');
    }
    else {
        console.warn('[sampling-sliders] WARNING: settings service unavailable — namespace NOT registered; only row config applies');
    }
}
