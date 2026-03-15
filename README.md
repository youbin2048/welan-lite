# Welan Lite

## ESP32 前端迁移路线

### 结论

最务实的产品化路线不是继续强拗 `ESPHome web_server` 直接承载你的完整首页，而是拆成两层：

1. `ESPHome` 继续负责设备控制内核。
2. 在同一颗 ESP32 上增加一个自定义静态页面服务层，作为用户访问入口。

这样可以保留你现在已经验证通过的控制逻辑、实体模型和 REST 接口，同时把默认 ESPHome 页面降级为内部 API/调试入口，而不是用户首页。

### 推荐技术路线

#### 路线 A：继续以 ESPHome 为内核，增加外部组件承载自定义前端

这是首选路线，原因：

- 你当前的时段逻辑、手动覆盖、亮度记忆已经在 YAML 里跑通，重写成本高。
- 前端已经基于 ESPHome REST API 和 `/events` 联调成功，协议层可以继续复用。
- 风险集中在“怎么提供首页”，不是“怎么控制灯”。

建议形态：

- 保留 `firmware/welan-lite-v1.0.3.yaml` 里的控制实体、脚本、定时逻辑。
- 通过 ESPHome 的外部组件或自定义组件，在设备上挂一个轻量 HTTP 文件服务。
- 设备根路径 `/` 返回你的 `index.html`。
- 自定义页面中的接口继续请求同机地址下的 `/api/...` 和 `/events`。
- ESPHome 默认页面不再暴露为用户首页，只作为备用调试入口。

#### 路线 B：放弃 ESPHome web_server 首页，改为 Arduino/ESP-IDF 原生应用

只有在下面情况再切换：

- 你确认 ESPHome 侧无法稳定挂载自定义静态资源。
- 或者你后续要做更复杂的鉴权、资源压缩、路由、离线缓存。

代价：

- 需要把当前 YAML 控制逻辑整体迁移成 C++/ESP-IDF 或 Arduino 代码。
- 你已经验证通过的控制层要重写，开发周期明显增加。

当前阶段不建议直接走这条路线。

### 分阶段迁移

#### 第 1 步：冻结 API 契约，不再让前端依赖 Docker 代理

目标：

- 前端直接按设备本机路径访问。
- 所有请求路径从“依赖 nginx 转发”改为“直接打到同源设备接口”。

前端需要满足：

- API 基地址固定为相对路径，例如 `/api/`。
- 事件流固定为 `/events`。
- 所有 POST 保持 `body: ""`，不能去掉。

需要改的文件：

- `ui/app.js`
- 如果 `index.html` 里写了 NAS 域名或端口，也要一起改 `ui/index.html`

可以继续复用：

- 现有实体名称映射
- 现有 UI 结构
- 现有弹层、滑条、快捷亮度、确认逻辑

必须调整：

- 去掉任何硬编码 NAS 地址、容器地址、反代地址

#### 第 2 步：把前端静态资源收敛成 ESP32 可承载版本

目标：

- 压缩资源体积
- 降低连接数
- 提高首屏速度

建议：

- 合并资源为最少文件数，优先考虑：
  - `index.html`
  - `app.css`
  - `app.js`
- 图片、字体、第三方库尽量不要引入。
- 不使用 React、Vue、打包器运行时。
- CSS 和 JS 尽量手写，避免大型依赖。

需要改的文件：

- `ui/index.html`
- `ui/style.css`
- `ui/app.js`

可以继续复用：

- 现有纯静态方案本身就很适合迁移到 ESP32

建议新增：

- `ui/dist/index.html`
- `ui/dist/app.css`
- `ui/dist/app.js`

说明：

开发态文件和最终烧录态文件分开，后续压缩和嵌入更清晰。

#### 第 3 步：在固件侧增加静态资源托管能力

目标：

- 设备访问 `/` 时直接返回你的页面
- 静态资源由 ESP32 本机提供

推荐做法：

1. 把打包后的前端文件存入 `LittleFS` 或 `SPIFFS`
2. 固件启动后注册：
   - `/` -> `index.html`
   - `/app.css` -> CSS 文件
   - `/app.js` -> JS 文件
3. 保留 ESPHome API 与 `/events`

这一层如果继续基于 ESPHome，通常需要：

- 在 YAML 中接入 `external_components`
- 新增一个自定义组件目录，例如 `firmware/components/web_assets/`
- 组件里用 Arduino `WebServer` 或 ESP-IDF HTTP server 提供静态资源

需要新增的文件：

- `firmware/components/web_assets/manifest.json`
- `firmware/components/web_assets/__init__.py`
- `firmware/components/web_assets/web_assets.h`
- `firmware/components/web_assets/web_assets.cpp`
- `firmware/assets/index.html.gz`
- `firmware/assets/app.css.gz`
- `firmware/assets/app.js.gz`

需要改的文件：

- `firmware/welan-lite-v1.0.3.yaml`

YAML 层要增加的方向：

- `external_components`
- 文件系统支持
- 组件初始化配置

#### 第 4 步：处理“设备 IP 打开即进入自定义首页”

这是产品体验的关键点。

你要的不是“另一个路径能访问 UI”，而是“根路径就是 UI”。因此必须满足：

- `http://设备IP/` 返回自定义 `index.html`
- 页面内部请求 `/api/...`
- 页面内部订阅 `/events`

如果 ESPHome 默认 `web_server` 占用根路径且不能覆写首页，处理方式有两种：

1. 同端口覆写首页
2. 双端口运行，再在 80 端口做入口转发

优先级：

- 优先同端口覆写首页
- 如果做不到，再考虑：
  - 80 端口给自定义首页
  - ESPHome 默认页面移到备用端口，比如 `81`

这样用户访问体验才是对的。

#### 第 5 步：把 ESPHome 默认页面降级为调试入口

目标：

- 不再作为用户产品 UI
- 但保留排障和开发价值

建议：

- 用户入口固定是 `/`
- 调试入口改成：
  - 备用端口，例如 `:81`
  - 或保留内部路径，例如 `/legacy`

这一步是否能完全做到，取决于你采用的自定义组件能力。

#### 第 6 步：做资源轻量化与稳定性收尾

要点：

- HTML/CSS/JS 开启 gzip 预压缩
- 前端避免轮询，继续优先使用 `/events`
- 首屏只加载必要状态
- 时间、亮度、开关操作保持增量刷新
- 保留断线重连逻辑

建议控制目标：

- `index.html` 压缩后尽量 < 12 KB
- `app.css` 压缩后尽量 < 8 KB
- `app.js` 压缩后尽量 < 25 KB

对于 ESP32-C3，这样更稳。

### 文件层面的实际调整建议

#### 固件目录

建议演进为：

```text
firmware/
├─ welan-lite-v1.0.3.yaml
├─ assets/
│  ├─ index.html.gz
│  ├─ app.css.gz
│  └─ app.js.gz
└─ components/
   └─ web_assets/
      ├─ __init__.py
      ├─ manifest.json
      ├─ web_assets.h
      └─ web_assets.cpp
```

#### UI 目录

建议演进为：

```text
ui/
├─ src/
│  ├─ index.html
│  ├─ style.css
│  └─ app.js
├─ dist/
│  ├─ index.html
│  ├─ app.css
│  └─ app.js
├─ tools/
│  └─ build-assets.ps1
├─ nginx.conf
├─ Dockerfile
└─ docker-compose.yml
```

说明：

- `src/` 继续做开发版页面
- `dist/` 存放准备烧录进 ESP32 的产物
- Docker 相关文件可以暂时保留，仅用于开发联调，不再作为产品依赖

### 哪些部分继续复用

- `firmware/welan-lite-v1.0.3.yaml` 里的控制逻辑主体
- 现有实体 name 约定
- 前端中文 UI 结构
- 场景一/二/三命名
- `/events` 的实时同步思路
- POST 必须带空 body 的调用方式

### 哪些部分必须换方案

- `ui/nginx.conf` 只适合 NAS 联调，最终产品不能继续依赖
- `ui/Dockerfile`
- `ui/docker-compose.yml`
- 任何写死 NAS IP、端口、反向代理路径的前端代码
- “默认 ESPHome 首页就是产品首页”这个思路

### 当前仓库状态

当前前端文件已经补齐，并且已经适合进入“发布产物驱动”的迁移阶段：

- `ui/src/index.html`
- `ui/src/style.css`
- `ui/src/app.js`
- `ui/dist/index.html`
- `ui/dist/app.css`
- `ui/dist/app.js`
- `ui/tools/build-assets.ps1`

这意味着：

1. 开发源码与烧录产物已经可以分开维护
2. 后续固件侧只需要对接 `ui/dist/` 产物
3. Docker 开发态也可以改为只服务 `dist/`

### 下一步最合理执行顺序

1. 先把现有前端文件补到仓库：`ui/index.html`、`ui/style.css`、`ui/app.js`
2. 我基于真实代码先做一次“ESP32 托管适配”
3. 再补一个最小可行的 `firmware/components/web_assets/` 方案
4. 最后把 Docker 开发态和 ESP32 产品态分开

### 直接判断

你的当前项目最合理的路线是：

- 短期：`ESPHome + 自定义静态资源服务`
- 中期：设备根路径直接进入自定义中文首页
- 长期：只有当 ESPHome 静态托管能力成为明确瓶颈时，再迁移到原生 Arduino/ESP-IDF

这条路线最省重写成本，也最符合“独立设备产品”的目标。
