# iOS Glass Sidebar 安全区修复

这是一个独立的 Home Assistant 前端模块，修复 Glass Sidebar 在 iOS/iPadOS
HA App 中打开手机侧边栏时，顶部内容与系统状态栏重叠的问题。

模块只在 iOS/iPadOS 上生效，并且只调整宽度不超过 600px 的侧边栏抽屉。
它使用 iOS 安全区值，并读取 Glass Sidebar 缓存的手机圆角/间距设置；不会修改
Glass Sidebar 的 HACS 文件，因此插件更新不会覆盖此修复。

## 安装

1. 下载本仓库根目录的 `ios-glass-sidebar-fix.js`，复制到 Home Assistant 配置目录的 `www`
   文件夹中（如不存在则创建），最终路径为：
   `config/www/ios-glass-sidebar-fix.js`
2. 在 HA 中打开 **设置 → 控制面板 → 右上角菜单 → 资源**。
3. 添加资源：
   - URL：`/local/ios-glass-sidebar-fix.js`
   - 类型：`JavaScript 模块`
4. 在 iOS HA App 中重置前端缓存：**设置 → Companion App → 调试 → 重置前端缓存**，
   然后重新打开 HA。

升级脚本后，可在资源 URL 后添加或更新版本参数，例如
`/local/ios-glass-sidebar-fix.js?v=2`，再重置一次前端缓存。

## 卸载

在“资源”中删除该模块，并删除 `config/www/ios-glass-sidebar-fix.js`。
