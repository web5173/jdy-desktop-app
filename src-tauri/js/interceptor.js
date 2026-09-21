const raf = requestAnimationFrame;
const checkRender = () =>
    document.readyState !== 'complete'
        ? raf(checkRender)
        : window.__TAURI_INTERNALS__.invoke('close_splashscreen');

raf(checkRender);