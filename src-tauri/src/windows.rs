use fastrand::u64;
use tauri::{
    webview::{DownloadEvent, NewWindowResponse},
    AppHandle, Emitter, Error, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};
pub fn create_new_window(
    app_handle: AppHandle,
    url: WebviewUrl,
    label: Option<String>,
) -> Result<WebviewWindow, Error> {
    let (window_label, is_main_window) = match label {
        Some(custom_label) => (custom_label, true),
        None => (format!("jdy_{}", u64(..)), false),
    };

    let builder = WebviewWindowBuilder::new(&app_handle, &window_label, url)
        .visible(!is_main_window)
        .title("简道云")
        .disable_drag_drop_handler()
        .zoom_hotkeys_enabled(true)
        .on_document_title_changed(|w, t| {
            _ = w.set_title(t.as_str());
        })
        .on_download(|window, event| match event {
            DownloadEvent::Requested { .. } => {
                let _ = window.emit("download-event", "started");
                true
            }
            DownloadEvent::Finished { success, .. } => {
                let _ = window.emit(
                    "download-event",
                    if success { "completed" } else { "failed" },
                );
                success
            }
            _ => true,
        })
        .on_new_window({
            let app_handle = app_handle.clone();
            move |url, _features| match url.domain() {
                Some(d) if d.ends_with("jiandaoyun.com") && d != "files.jiandaoyun.com" => {
                    create_new_window(app_handle.clone(), WebviewUrl::External(url.into()), None)
                        .map(|window| NewWindowResponse::Create { window })
                        .unwrap_or(NewWindowResponse::Deny)
                }
                _ => NewWindowResponse::Allow,
            }
        })
        .initialization_script(include_str!("../js/i.js"));
    (if is_main_window {
        builder.initialization_script(include_str!("../js/ready.js"))
    } else {
        builder
    })
    .build()
}
