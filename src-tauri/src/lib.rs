// 提前声明所有需要使用的模块和类型
use tauri::async_runtime::spawn_blocking;
use tauri::{Listener, Manager, WebviewUrl};


mod windows;

#[tauri::command]
fn set_corp_id(corp_id: &str) -> String {
    println!("Received corpId: {}", corp_id);
    corp_id.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            let handle_for_async = handle.clone();

            // 使用提前声明的 spawn_blocking
            spawn_blocking(move || {
                let _window = crate::windows::create_new_window(
                    handle_for_async.clone(),
                    WebviewUrl::App("https://www.jiandaoyun.com/dashboard#/".into()), // 使用提前声明的 WebviewUrl
                    Some("jdy".to_string()),
                );
            });

            app.once("ready", move |_event| {
                handle.get_webview_window("splashscreen").map(|w| w.close());
                handle.get_webview_window("jdy").map(|w| {
                    _ = w.show();
                    _ = w.maximize();
                    _ = w.set_focus();
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_corp_id])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
