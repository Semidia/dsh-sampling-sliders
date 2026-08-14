# dsh-sampling-sliders

[English](#english) · 中文

在 DeepSeek Harness（DSH）输入栏里加一个**「采样」按钮**，点击弹出 `temperature` / `maxTokens` 滑杆，支持**热调**与**持久化**两种模式，作用于**所有 Provider（官方 / 第三方）**。

---

## 功能

- **紧凑入口**：按钮位于输入栏模型切换键旁（`conversation.input.right`），不占设置页。
- **两个滑杆**：
  - `temperature`：0.00 – 2.00（步进 0.05），带「覆盖」开关。
  - `maxTokens`：512 – 32768（步进 256），带「覆盖」开关。
- **两种模式**（按钮切换）：
  - **热调**：只写插件内存，点「应用」后下一次模型调用即生效，插件停止/重启后失效。
  - **持久化**：点「应用」时写入工作区根目录的 `.dsh-sampling-params.json`，插件下次启动自动读回。
- 有覆盖生效时，按钮带一个品牌色圆点提示。

## 原理

拦截官方指定的 `agent/request` 瀑布事件（"Replace the frozen call configuration"）：

```js
ctx.on('agent/request', async (payload, next) => {
  const config = await next()          // 机器本会使用的配置
  const out = { ...config }
  if (typeof state.temperature === 'number') out.temperature = state.temperature
  if (typeof state.maxTokens === 'number') out.maxTokens = state.maxTokens
  return out                           // 返回替换后的配置
})
```

该事件在 Provider 路由**之前**触发，因此覆盖对官方 DeepSeek 与第三方 Provider 一律生效。

## 参数说明

DSH 的 `LlmCallConfig` 抽象层只暴露 `temperature`、`maxTokens`、`stop` 三个采样/输出字段（无 `top_p`/`top_k`），故本插件只做 `temperature` 与 `maxTokens` 两个滑杆。

## 安装 / 使用

当前形态为**动态 Cordis 插件**（进程内、临时）。两种装载方式：

1. **GUI 装载**：在 DSH Web GUI 中通过 `cordis_define` 把 `host.js` 的返回体作为 `code.host`、`client.js` 的返回体作为 `code.client`，然后 `cordis_run`。
2. **Agent 装载**：让一个 Agent 用 `cordis_define` / `cordis_run` 工具装载（本仓库即由此流程生成）。

> 转为 npm 可安装的 out-of-tree `dsh` 插件 bundle（包内提供 `exports["./client"]`）是更彻底的社区分发形态，可基于 `host.js` / `client.js` 的返回对象直接改造。

## 已知限制

- 覆盖仅在本插件运行期间生效；插件 `cordis_stop` / `undefine` 后不再注入（持久化文件只用于下次启动恢复）。
- 热调值不写入任何模型历史记录，只影响拦截器生效期间的后续调用。

## 文件结构

```
dsh-sampling-sliders/
├── host.js     # Host 半：agent/request 拦截 + RPC + JSON 持久化
├── client.js   # Client 半：输入栏按钮 + 弹层 UI
└── README.md
```

## License

MIT

---

<a name="english"></a>

# dsh-sampling-sliders

A DeepSeek Harness (DSH) dynamic plugin that adds a **"采样" button** in the composer tool row (next to the model selector). Clicking it opens a popover with `temperature` / `maxTokens` sliders, a **hot / persist** mode toggle, and apply / reset actions. Applies to **all providers** (official + third-party).

### How it works

Intercepts the `agent/request` waterfall (the sanctioned "replace the frozen call configuration" hook), which fires **before** provider routing, so the override reaches every provider. `persist` mode writes to `.dsh-sampling-params.json` under the workspace root and reloads it on startup.

### Parameters

- `temperature`: 0.00 – 2.00 (step 0.05), optional override.
- `maxTokens`: 512 – 32768 (step 256), optional override.

DSH's `LlmCallConfig` exposes only `temperature`, `maxTokens`, and `stop` (no `top_p`/`top_k`), hence these two sliders.

### Install

This is a **dynamic Cordis plugin**. Load `host.js` as `code.host` and `client.js` as `code.client` via `cordis_define`, then `cordis_run`. To distribute it as an npm-installable out-of-tree `dsh` bundle, adapt the returned Plugin objects into a package exposing `exports["./client"]`.

### Limitations

- Overrides apply only while the plugin is running; stopping/undefining the plugin removes the interceptor.
- Values are not written into model history; they only affect calls made while the interceptor is active.

## License

MIT
