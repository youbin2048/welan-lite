# Welan Lite

`Welan Lite` 是一个基于 `ESP32-C3 + ESPHome` 的本地灯控项目。

这个项目的目标很简单：做一盏可以本地网页控制、支持定时、支持正念呼吸灯、也支持 433 无线遥控开关的灯，而且不依赖云端。

如果你是第一次接触这类项目，也可以照着这份说明一步一步复现。

## 这个项目能做什么

- 用网页开灯、关灯、调亮度
- 设置 3 组定时任务
- 开启“正念模式”呼吸灯
- 用 433 遥控器直接控制灯的亮和灭
- 在网页里重新对码
- 用 OTA 在线升级固件

## 你需要准备什么

先准备下面这些硬件：

- `ESP32-C3` 开发板 1 块
- 可 PWM 调光的灯 1 套
- `灵-R1A M5 串口对码版` 433 接收模块 1 块
- 433 遥控器 1 个
- 若要支持“重新对频”功能：
  - 一个三极管
  - 一个基极限流电阻，常见可用 `1k` 到 `4.7k`
- 杜邦线若干
- USB 数据线 1 条

建议你先确认一件事：

- 这份仓库当前适配的是 `灵-R1A M5 串口对码版`
- 也就是 433 模块通过 `D0` 输出串口数据给 ESP32
- 不是把 `D0-D3` 当普通按键电平来读

## 接线方式

### 1. 灯控输出

- 灯的 PWM 控制脚接 `GPIO10`

### 2. 433 接收模块

- 模块 `VCC -> ESP32 3.3V`
- 模块 `GND -> ESP32 GND`
- 模块 `D0 -> ESP32 GPIO3`

注意：

- 这里用的是 `M5 串口模式`
- `GPIO3` 是作为串口接收脚使用
- 这种接法下，不需要给 `GPIO3` 再加上拉电阻

### 3. 无线遥控重新对频

如果你希望网页里可以点击“无线遥控重新对频”，再接这一组：

- `GPIO1 -> 电阻 -> 三极管基极`
- 三极管发射极 `-> GND`
- 三极管集电极 `-> 433 模块 KO/K1`

这一组的作用是：

- 用 ESP32 模拟按一下模块上的对码按键
- 这样你不用手碰模块，也能在网页里重新配对遥控器

## 这个项目现在的功能逻辑

### 网页控制

设备联网后，可以直接在浏览器打开设备 IP。

网页里可以完成这些操作：

- 开灯和关灯
- 调整亮度
- 设置 3 组定时
- 开启或退出正念模式
- 无线遥控重新对频
- OTA 升级

### 433 遥控控制

现在这版已经按 `M5 串口模块` 做了适配：

- 遥控器按一下，灯切换一次亮灭
- 长按不会来回乱跳
- 已经做过重复报码去重处理

### 正念模式

正念模式是一个呼吸灯效果，当前节奏是：

- 5 秒逐渐变亮
- 最亮停 1 秒
- 5 秒逐渐变暗
- 到最暗后不额外停留，直接进入下一轮

这个模式已经按当前灯具的实际 PWM 特性做过映射处理。

简单说就是：

- 不是直接拿 `0-255` 生硬渐变
- 已避开灯具在低亮度区的死区

## 第一次刷机怎么做

如果你是第一次把程序刷进这块板子，建议按下面步骤来。

### 第 1 步：安装环境

你需要先安装：

- [ESPHome](https://esphome.io/)
- Python

如果你已经有 ESPHome，可以跳过这一步。

### 第 2 步：查看主配置文件

这个项目的主配置文件在这里：

- [firmware/welan-lite-v1.0.3.yaml](E:\esp32_switch\welan-lite\firmware\welan-lite-v1.0.3.yaml)

### 第 3 步：编译固件

在仓库根目录执行：

```powershell
esphome compile firmware\welan-lite-v1.0.3.yaml
```

### 第 4 步：首次烧录

首次烧录一般建议用 USB 串口方式。

如果你的 ESPHome 环境已经能识别串口设备，可以直接执行：

```powershell
esphome run firmware\welan-lite-v1.0.3.yaml
```

它会自动：

- 编译
- 烧录
- 启动日志查看

### 如果你手里已经有编译好的 `.bin` 固件

很多新手拿到仓库后，手里可能已经有别人编译好的固件文件，这种情况下不一定要自己重新编译。

你可以直接刷 `.bin`。

常见会遇到两种文件：

- `firmware.factory.bin`
  - 适合第一次通过 USB 串口刷机
- `firmware.ota.bin`
  - 适合设备已经在线后，通过网页 OTA 升级

也就是说：

- 第一次刷机，优先用 `factory` 包
- 后续在线升级，优先用 `ota` 包

### 用浏览器网页工具刷 `.bin`

如果你不想折腾命令行，最适合新手的方法是直接用浏览器烧录。

可以使用 ESPHome 官方网页烧录器：

- [ESPHome Web](https://web.esphome.io/)

操作步骤：

1. 用 USB 数据线把 ESP32 接到电脑
2. 打开上面的网页
3. 点击 `Connect`
4. 选择你的 ESP32 串口
5. 选择要刷入的 `.bin` 文件
6. 等待刷写完成
7. 刷完后重启设备

注意：

- 必须用“能传数据”的 USB 线，很多线只能充电
- 推荐用 `Chrome` 或 `Edge`
- 如果第一次连不上，换一根数据线往往比折腾半天更有效

### 用命令行刷 `.bin`

如果你更习惯命令行，也可以直接把 `.bin` 写进芯片。

常见做法是用 `esptool`。

先安装：

```powershell
pip install esptool
```

然后执行类似下面的命令：

```powershell
esptool.py --chip esp32c3 --port COM3 --baud 460800 write_flash 0x0 firmware.factory.bin
```

你需要按实际情况替换：

- `COM3` 改成你电脑识别到的串口号
- `firmware.factory.bin` 改成你的固件文件路径

如果你不知道串口号，可以在 Windows 设备管理器里看：

- 插上板子前后，对比新增的串口设备

### 刷机失败时怎么办

如果你已经有 `.bin`，但就是刷不进去，优先排查下面几项：

- USB 线是不是数据线
- 串口号有没有选对
- 驱动有没有装好
- 板子有没有进入下载模式

有些 ESP32 小板在烧录时需要手动操作：

1. 按住 `BOOT`
2. 再按一下 `RESET`
3. 松开 `RESET`
4. 最后松开 `BOOT`

如果网页或命令行一直连不上，可以试一次这个动作。

### 第 5 步：连上网络

设备启动后：

- 让它连上你在配置里写好的 Wi-Fi
- 然后在路由器后台或串口日志里找到它的 IP 地址

### 第 6 步：打开网页

在浏览器里输入设备 IP，就能看到控制页面。

## 日常使用怎么做

### 开关灯

- 可以在网页里点按钮
- 也可以直接按 433 遥控器

### 调亮度

- 在网页里拖动亮度即可

### 设置定时

项目内置了 `T1 / T2 / T3` 三组定时：

- 每组都可以单独启用或关闭
- 可以设置开始时间
- 可以设置结束时间
- 可以设置该时段的亮度

### 进入正念模式

网页里点击“进入正念”即可。

如果你想退出，再点“退出正念”。

### 无线遥控重新对频

如果你的遥控器需要重新配对：

1. 打开网页
2. 进入系统页
3. 点击“无线遥控重新对频”
4. 再按一下遥控器上的目标按键

## OTA 升级怎么做

当设备已经在线，并且网页可访问时，可以直接用 OTA 升级。

操作方式：

1. 打开设备网页
2. 进入系统页
3. 选择新的 `.bin` 固件文件
4. 等待上传和重启

如果你已经编译过固件，常用的是 OTA 包。

## 仓库里重要文件在哪

主固件配置：

- [firmware/welan-lite-v1.0.3.yaml](E:\esp32_switch\welan-lite\firmware\welan-lite-v1.0.3.yaml)

网页源码：

- [ui/src/index.html](E:\esp32_switch\welan-lite\ui\src\index.html)
- [ui/src/app.js](E:\esp32_switch\welan-lite\ui\src\app.js)
- [ui/src/style.css](E:\esp32_switch\welan-lite\ui\src\style.css)

网页打包产物：

- [ui/dist/index.html](E:\esp32_switch\welan-lite\ui\dist\index.html)
- [ui/dist/app.js](E:\esp32_switch\welan-lite\ui\dist\app.js)
- [ui/dist/app.css](E:\esp32_switch\welan-lite\ui\dist\app.css)

固件内嵌网页资源：

- [firmware/assets/index.html.gz](E:\esp32_switch\welan-lite\firmware\assets\index.html.gz)
- [firmware/assets/app.js.gz](E:\esp32_switch\welan-lite\firmware\assets\app.js.gz)
- [firmware/assets/app.css.gz](E:\esp32_switch\welan-lite\firmware\assets\app.css.gz)

## 如果你改了网页，要做什么

如果你修改了 `ui/src` 里的网页源码，需要重新生成资源：

```powershell
powershell -ExecutionPolicy Bypass -File ui\tools\build-assets.ps1
```

然后再重新编译固件：

```powershell
esphome compile firmware\welan-lite-v1.0.3.yaml
```

## 如果你遇到问题，先看这里

### 1. 网页能打开，但遥控器没反应

先检查这几项：

- 433 模块是不是 `灵-R1A M5 串口对码版`
- 模块 `D0` 是不是接到了 `GPIO3`
- 模块供电是不是 `3.3V`
- `GND` 有没有共地

### 2. 遥控器能控制，但网页里重新对频没反应

先检查：

- `GPIO1` 那一路有没有接三极管
- 三极管和电阻方向有没有接对
- 模块 `KO/K1` 脚有没有正确接入

### 3. 网页改了，但设备页面没变化

通常是以下原因：

- 你还没重新执行 `build-assets.ps1`
- 你还没重新编译固件
- 浏览器缓存了旧页面，可以强制刷新一次

### 4. 第一次烧录失败

常见原因：

- USB 线只有充电功能，没有数据功能
- 串口驱动没装好
- 开发板没有进入下载模式

## 适合谁用

如果你符合下面这几种情况，这个仓库就比较适合你：

- 想做一盏本地控制的小灯
- 不想依赖云端
- 想要网页控制 + 实体遥控器同时可用
- 能接受自己接线和刷固件

## 当前版本说明

当前仓库已经整合完成这些能力：

- 本地网页控制
- 亮度控制
- 三组定时
- 正念模式
- 433 串口遥控控制
- 无线遥控重新对频
- OTA 升级

如果你只是想复现这个项目，按照这份 README 逐步接线和刷机即可。
