use dotenv::dotenv;
use std::env;
use tauri::Manager;

mod commands;
mod db;
mod games;
mod music;

fn main() {
    // Загружаем переменные окружения из .env файла
    dotenv().ok();

    // Читаем переменную RAWG_API_KEY
    let api_key = env::var("RAWG_API_KEY").expect("RAWG_API_KEY must be set in .env");

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
            // commands::authenticate_spotify,
            commands::search_tracks,
            // commands::get_trending,
            // commands::exchange_code_for_token,
            // commands::refresh_spotify_token,
            commands::get_cpu_usage,
            commands::get_memory_usage,
            commands::enable_hotspot,
            commands::disable_hotspot,
            commands::get_hotspot_status,
            commands::sleep_mode,
            commands::shutdown,
            commands::add_links,
            commands::get_links,
            commands::update_link,
            commands::delete_link,
            commands::exchange_codes,
            commands::refresh_tokens,
            commands::get_user_profiles,
            commands::search_tracks,
            commands::get_current_tracks,
            commands::get_user_playlists,
            commands::get_playlist_tracks,
            commands::play_tracks,
            commands::pause_playbacks,
            commands::skip_tracks,
            commands::previous_tracks,
            commands::get_auth_url,
            commands::auth_callback,
            commands::fetch_albums,
            commands::add_profiles,
            commands::update_profiles,
            commands::get_profiles_command,
            commands::delete_profiles,
            commands::add_note_command,
            commands::get_notes_command,
            commands::update_note_command,
            commands::delete_note_command,
        ])
        .setup(move |app| {
            // Передаем API-ключ в состояние приложения
            app.manage(api_key.clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Ошибка запуска приложения");
}

