const raf = requestAnimationFrame;
const checkRender = () =>
    document.readyState !== 'complete'
        ? raf(checkRender)
        : window.__TAURI__.event.emit('ready');

raf(checkRender);