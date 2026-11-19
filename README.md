# iOS Glass Sidebar 安全区修复

一个独立的 Home Assistant 前端模块，修复 Glass Sidebar 在 iOS/iPadOS HA App
中打开手机侧边栏时，顶部内容与系统状态栏重叠的问题。

模块只在 iOS/iPadOS 上生效，并且只调整宽度不超过 600px 的侧边栏抽屉。它使用
iOS 安全区值，并读取 Glass Sidebar 缓存的手机圆角/间距设置；不会修改原插件，
因此 Glass Sidebar 更新不会覆盖此修复。

## 通过 HACS 安装

> HACS 不能使用私有 GitHub 仓库。要通过 HACS 安装，仓库必须设为公开。

1. 在 HACS 菜单中选择 **自定义仓库**，添加本仓库 URL：
   `https://github.com/dw881114/ios-glass-sidebar-safe-area-fix`
2. 类型选择 **Dashboard**，然后添加并下载此仓库。
3. 在 **设置 → 控制面板 → 资源** 中添加：
   - URL：`/hacsfiles/ios-glass-sidebar-safe-area-fix/ios-glass-sidebar-safe-area-fix.js`
   - 类型：`JavaScript 模块`
4. 在 iOS HA App 中重置前端缓存：**设置 → Companion App → 调试 → 重置前端缓存**，
   然后重新打开 HA。

HACS 下载前端文件，但资源仍需在 HA 中手动登记。

## 手动安装

将仓库根目录的 `ios-glass-sidebar-safe-area-fix.js` 复制到 HA 配置目录的 `www`
文件夹，添加资源 `/local/ios-glass-sidebar-safe-area-fix.js`（类型选
**JavaScript 模块**），然后重置 iOS App 的前端缓存。

## 卸载

删除 HA 资源，并删除对应的 JS 文件；如果从 HACS 下载，也可在 HACS 中移除此仓库。
