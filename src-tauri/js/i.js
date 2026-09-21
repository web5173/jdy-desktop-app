document.addEventListener('DOMContentLoaded', () => {
    try {
        const corpId = window?.jdy_workbench_config?.corpId;
        if (corpId) window.__TAURI__.core.invoke('set_corp_id', { corpId });

        const appWebview = window.__TAURI__.webviewWindow.getCurrentWebviewWindow();
        appWebview.listen('download-event', (event) => {
            const status = event.payload;
            const message = status === 'started' ? '下载开始' :
                status === 'completed' ? '下载完成' : '下载失败';
            const loading = status === 'started';
            const duration = status === 'failed' ? 0 : 1500;
            showToast(message, loading, false, duration);
        });
    } catch (error) {
        console.error('Error in initialization script:', error);
    }
});
// document.addEventListener('click', function (e) {
//     const target = e.target.closest('a');
//     if (target && target.href) {
//         // 如果是外部链接，通过 Tauri 命令处理
//         if (!target.href.startsWith(window.location.origin)) {
//             e.preventDefault();
//             // 调用后端命令打开链接
//             window.open(target.href);
//         }
//     }
// }, true);
// document.addEventListener('click', function (e) {
//     const target = e.target.closest('a');
//     if (target && target.href) {
//         // 解析当前页面和目标链接的主域名
//         const currentDomain = window.location.hostname;
//         const targetDomain = new URL(target.href).hostname;

//         // 如果主域名不同，则视为外部链接
//         if (targetDomain !== currentDomain) {
//             e.preventDefault();
//             window.__TAURI__.shell.open(target.href); // 使用 Tauri 打开外部链接
//         }
//     }
// }, true);

/**
* 显示 toast 提示
* @param {string} message - 提示信息
* @param {boolean} [loading=true] - 是否显示加载动画，默认为 true
* @param {boolean} [showOverlay=true] - 是否显示遮罩层，默认为 true
* @param {number} [duration=1500] - 显示时长（毫秒）, 0 表示不关闭，默认3000
*/
function showToast(message, loading = true, showOverlay = true, duration = 3000) {
    const elements = [];

    if (showOverlay) {
        const overlay = document.createElement("div");
        overlay.className = "x-window-mask mask-appear";
        document.body.appendChild(overlay);
        elements.push(overlay);
    }

    const toast = document.createElement("div");
    toast.className = "x-msg-toast-container cloned";
    toast.style = "top: 40%;";
    toast.innerHTML = `
        <div class="x-msg-toast x-msg-toast-appear">
            <div class="x-msg-toast-content ${loading ? "loading" : ""} colorful">
                <div class="x-msg-toast-icon"><i></i></div>
                <div class="x-msg-toast-text">${message}</div>
            </div>
        </div>`;
    document.body.appendChild(toast);
    elements.push(toast);

    if (duration) {
        setTimeout(() => elements.forEach(el => el?.remove()), duration);
    }

    return elements;
}
