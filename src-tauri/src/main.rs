#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use std::env;
use tauri::{
    AppHandle, Manager,
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
};
use tauri_plugin_single_instance::init as SingleInstance;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt}; // ✅ Новый API
use tauri_plugin_updater::UpdaterExt; // ✅ Импорт UpdaterExt (фикс ошибки)

mod commands;
mod db;
mod games;
mod music;

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_shell::init()) // ✅ Shell API
        .plugin(SingleInstance(|_app, _args, _cwd| {
            println!("⚠️ Приложение уже запущено!");
        }))
        .setup(|app| {
            let app_handle = app.app_handle();

            // ✅ Включаем автозапуск
            let autostart_manager = app.autolaunch();
            if let Err(e) = autostart_manager.enable() {
                println!("❌ Ошибка включения автозапуска: {:?}", e);
            } else {
                println!("✅ Автозапуск включен!");
            }

            // 🔄 **Проверка обновлений** (ФИКС передаваемого типа)
            let app_clone = app_handle.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = update(app_clone).await {
                    println!("❌ Ошибка автообновления: {:?}", e);
                }
            });

            // 🔥 **Создаём трей-меню**
            let quit_item = MenuItem::with_id(app_handle, "quit", "Выход", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app_handle, &[&quit_item])?;

            let tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .show_menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        println!("Выход");
                        app.exit(0);
                    }
                    _ => {
                        println!("Обработано меню: {:?}", event.id);
                    }
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        println!("Левый клик по иконке трея");
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {
                        println!("Другое событие трея: {:?}", event);
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::create_project,
            commands::list_projects,
            commands::add_todo,
            commands::get_todos,
            commands::update_todo,
            commands::delete_todo,
            commands::scan_and_fetch_games,
            commands::launch_game,
            commands::open_url,
            commands::open_in_vscode,

            commands::get_cpu_usage,
            commands::get_memory_usage,
            commands::get_process_count,
            commands::get_uptime,
            commands::get_battery_info,

            commands::lock,
            commands::restart,
            commands::sleep_mode,
            commands::shutdown,
            commands::open_task_manager,
            commands::open_settings,
            commands::open_explorer,

            commands::add_links,
            commands::get_links,
            commands::update_link,
            commands::delete_link,

            commands::search_tracks_audius_command,
            commands::search_playlists_audius_command,
            commands::get_playlist_tracks_audius_command,
            commands::get_track_stream_url_command,
            commands::get_trending_tracks_command,

            commands::add_profiles,
            commands::update_profiles,
            commands::get_profiles_command,
            commands::delete_profiles,

            commands::add_note_command,
            commands::get_notes_command,
            commands::update_note_command,
            commands::delete_note_command,

            commands::kanban_add_task_command,
            commands::kanban_delete_task_command,
            commands::kanban_update_task_command,
            commands::kanban_list_tasks_command,

            commands::add_event_command,
            commands::get_events_by_date_command,
            commands::delete_event_command,
            commands::update_event_command,
            commands::complete_text,

            commands::add_home_apps,
            commands::get_home_apps,
            commands::delete_home_app,
            commands::launch_home_app,
            commands::open_dashflow_folder,
            commands::save_video,

            commands::drop_games_table,
        ])
        .run(tauri::generate_context!())
        .expect("Ошибка запуска приложения");
}

/// 🔄 **Функция проверки обновлений**
async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
    if let Some(update) = app.updater()?.check().await? {
        let mut downloaded = 0;

        println!("🔄 Найдено обновление: {:?}", update.version);

        // ✅ Скачивание и установка обновления
        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    println!("📥 Загружено {}/{}", downloaded, content_length.unwrap_or(0));
                },
                || {
                    println!("✅ Загрузка завершена.");
                },
            )
            .await?;

        println!("✅ Обновление установлено. Перезапуск...");
        app.restart();
    } else {
        println!("✅ Установлена последняя версия.");
    }

    Ok(())
}
