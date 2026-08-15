# dsh-sampling-sliders

模型采样参数滑杆 — DeepSeek Harness (DSH) 插件。输入栏「采样」按钮弹出面板，用 `temperature` / `maxTokens` 滑杆微调每次模型调用的采样参数，经 `agent/request` 钩子作用于**所有 Provider**（官方 DeepSeek 与第三方接入）。

Model sampling sliders for DeepSeek Harness: a "采样" button next to the model selector opens temperature / maxTokens sliders that tune every model call for **all providers** via the `agent/request` hook.

## 功能 / Features

- 输入栏「采样」按钮（`conversation.input.right`），点击弹出面板。
- `temperature`（0–2，步进 0.05）、`maxTokens`（512–32768，步进 256）滑杆，各带「覆盖」开关；不勾选 = 跟随模型默认。
- **热调 / 持久化** 两种模式：
  - 持久化：值写入 settings，长期生效（重启仍在）。
  - 热调：值本次运行生效，**下次启动自动清除**。
- 作用于所有 Provider（拦截发生在 Provider 路由之前）。

## 原理 / How it works

- **Host**（`src/index.ts`）：`inject: ['settings']`，注册 `sampling-sliders` settings 命名空间（schema：`{ mode, temperature?, maxTokens? }`），并监听 `agent/request` 瀑布事件：`await next()` 拿到机器本会使用的 `LlmCallConfig`，若命名空间里有数值就合并进返回的替换配置。启动时若发现残留的 `mode: 'hot'` 值会清空（热调语义）。
- **Client**（`dist/client.js`）：`window.__ModuleLoader__.load({ id, factory })` 浏览器 bundle，经 `connection.api.settings.describe/update/replace` 读写命名空间，渲染按钮与弹层。

## 安装 / Install

Out-of-tree bundle（GitHub 直装，无需 npm 账号）：

```sh
# 1. 构建
npm install && npm run build

# 2. 装进 profile（本地目录方式，或 pnpm add link:）
dsh plugin --profile web add link:D:/path/to/dsh-sampling-sliders

# 3. 组合挂载（两种任选其一）
#    a. 加入 profile package.json 的 dsh.profile.bundles（会应用本包 cordis.patch.yml 里的 insert 行）
#    b. 在 profile 的 cordis.patch.yml 里手动加：
#       - insert:
#           - id: sampling-sliders
#             name: dsh-sampling-sliders

# 4. 重启
dsh --profile web      # 或重启 web 服务
```

> 本包自带 `dsh.client` 元数据与 `exports["./client"]`，客户端 bundle 随页面加载自动注入；无需 npm publish。

## 文件结构 / Files

```
dsh-sampling-sliders/
├── src/index.ts      # Host：settings 注册 + agent/request 拦截（TypeScript 源码）
├── dist/index.js     # Host 编译产物（tsc）
├── dist/client.js    # Client bundle（window.__ModuleLoader__.load 工厂脚本）
├── cordis.patch.yml  # bundle 补丁（挂载行）
├── package.json      # npm 包描述 + dsh.bundle / dsh.client 元数据
└── tsconfig.json
```

## 已知限制 / Limitations

- 拦截器只在插件运行期间生效；值通过 settings 持久化，卸载插件后不再注入。
- `LlmCallConfig` 抽象层只暴露 `temperature` / `maxTokens` / `stop`（无 `top_p`），故滑杆做这两个字段。

## License

MIT
