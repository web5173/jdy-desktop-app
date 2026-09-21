# JDY Desktop

这是一个纯 Tauri 外壳项目，用于将简道云以桌面应用方式运行。

项目的核心职责是：

- 显示启动动画
- 创建主窗口
- 加载简道云 Web 页面
- 处理下载事件和新窗口行为
- 读取页面配置并传递给 Rust 侧命令

## 结构

- [src-tauri/src/lib.rs](src-tauri/src/lib.rs)：应用入口
- [src-tauri/src/windows.rs](src-tauri/src/windows.rs)：窗口和 Webview 逻辑
- [src-tauri/js/i.js](src-tauri/js/i.js)：页面初始化脚本
- [src-tauri/js/ready.js](src-tauri/js/ready.js)：页面就绪信号
- [public/splashscreen.html](public/splashscreen.html)：启动页面
- [src-tauri/tauri.conf.json5](src-tauri/tauri.conf.json5)：Tauri 配置

## 运行方式

```bash
cd src-tauri
cargo run
```

```bash
cargo build --release
```

## 说明

当前项目保持“纯 Tauri 外壳”模式：

- 业务逻辑由简道云 Web 页面承载
- 本地代码只负责桌面封装和系统级交互
- 不包含任何前端模板或框架说明
