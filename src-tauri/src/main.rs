use dotenv::dotenv;
use std::env;
use tauri::Manager;

mod commands;
mod db;
mod games;

fn main() {
    // Загружаем переменные окружения из .env файла
    dotenv().ok();

    // Читаем переменную RAWG_API_KEY
    let api_key = env::var("RAWG_API_KEY").expect("RAWG_API_KEY must be set in .env");
    let jamendo_api_key = env::var("JAMENDO_API_KEY").expect("JAMENDO_API_KEY must be set in .env");

    tauri::Builder::default()
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
            commands::search_tracks
        ])
        .setup(move |app| {
            // Передаем API-ключ в состояние приложения
            app.manage(api_key.clone());
            app.manage(jamendo_api_key.clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Ошибка запуска приложения");
}

