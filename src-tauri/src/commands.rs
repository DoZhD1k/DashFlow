// commands.rs
use tauri::command;
use std::process::Command;
use log::info;
use crate::games::{detection, rawg};
use crate::games::DetectedGame;
use crate::db;
use crate::music::spotify::{
    exchange_code, get_refresh_token, search_track, get_current_track, play_track,
    get_user_profile, get_user_playlist, get_playlist_track, pause_playback,
    skip_track, previous_track, get_authorize_url, handle_auth_callback, 
    fetch_albums_from_spotify, 
};

use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct SpotifyTokenResponse {
    access_token: String,
    token_type: String,
    expires_in: i32,
    refresh_token: Option<String>,
    scope: String,
}

/// Команда Tauri: открыть путь в VSCode.
#[command]
pub fn open_in_vscode(path: String) -> Result<(), String> {
    Command::new("code.cmd")
        .arg(&path)
        .spawn()
        .map_err(|e| format!("Ошибка запуска VSCode: {}", e))?;

    info!("Открыто в VSCode: {}", path);
    Ok(())
}

/// Команда Tauri: открыть URL.
#[command]
pub fn open_url(url: String) -> Result<(), String> {
    if webbrowser::open(&url).is_ok() {
        Ok(())
    } else {
        Err(format!("Не удалось открыть URL: {}", url))
    }
}
/// Команда Tauri: запуск игры.
#[tauri::command]
pub fn launch_game(path: String) -> Result<(), String> {
    if path.is_empty() {
        return Err("Путь к игре не указан.".to_string());
    }
    println!("путь: {}", path);

    // Заменяем '/' на '\' и обрезаем лишние пробелы
    let mut formatted_path = path.replace('/', "\\").trim().to_string();

    // Проверяем на наличие лишнего слеша в начале и убираем его
    if formatted_path.starts_with('\\') {
        formatted_path.remove(0);
    }

    // Добавляем кавычки вокруг пути
    // formatted_path = format!("\"{}\"", formatted_path);

    Command::new("cmd")
        .args(&["/C", "start", "", &formatted_path])
        .spawn()
        .map_err(|e| format!("Ошибка запуска игры: {}", e))?;

    info!("Игра успешно запущена: {}", formatted_path);
    Ok(())
}


#[command]
pub fn create_project(name: String, path: String, description: String) -> Result<i64, String> {
    db::add_project(name, path, description)
}

#[command]
pub fn list_projects() -> Result<Vec<db::Project>, String> {
    db::fetch_projects()
}

#[command]
pub fn add_todo(title: String, description: String) -> Result<(), String> {
    db::add_todo(title, description)
}

#[command]
pub fn get_todos() -> Result<Vec<db::Todo>, String> {
    db::fetch_todos()
}

#[command]
pub fn update_todo(id: i64, completed: bool) -> Result<(), String> {
    db::update_todo(id, completed)
}

#[command]
pub fn delete_todo(id: i64) -> Result<(), String> {
    db::delete_todo(id)
}


/// Команда Tauri: сканировать игры и получить данные из RAWG.
#[command]
pub async fn scan_and_fetch_games(
    state: tauri::State<'_, String>,
) -> Result<Vec<DetectedGame>, String> {
    let api_key = state.inner();
    let mut games = detection::scan_for_games()?; // Сканируем игры локально
    let client = rawg::create_client();

    for game in &mut games {
        let game_name_ref = &game.name;

        // Проверяем наличие игры в БД
        let conn = db::init_db()?;
        if let Some(cached_game) = db::get_game_by_name(&conn, game_name_ref)? {
            println!("Игра найдена в БД: {:?}", cached_game);
            game.description = cached_game.description.clone();
            game.cover = cached_game.cover.clone();
            game.url = cached_game.url.clone();
            game.genres = cached_game.genres.clone();
            game.developers = cached_game.developers.clone();
            game.platforms = cached_game.platforms.clone();
            continue;
        }

        // Если игры нет в БД, запрашиваем RAWG API
        if let Some(rawg_games) = rawg::fetch_games(&client, api_key, game_name_ref)
            .await
            .ok()
        {
            if let Some(first_game) = rawg_games.get(0) {
                println!("Данные из RAWG API для '{}': {:?}", game_name_ref, first_game);

                // Получаем детальную информацию об игре
                if let Some(details) =
                    rawg::fetch_game_details(&client, api_key, first_game.id).await.ok()
                {
                    game.description = details.description_raw.clone();
                    game.cover = details.background_image.clone();
                    game.url = Some(format!("https://rawg.io/games/{}", details.id));

                    game.genres = details
                        .genres
                        .map(|g| g.iter().map(|genre| genre.name.clone()).collect());
                    game.developers = details
                        .developers
                        .map(|d| d.iter().map(|dev| dev.name.clone()).collect());
                    game.platforms = details
                        .platforms
                        .map(|p| p.iter().map(|p| p.platform.name.clone()).collect());

                    println!("Сохраняем данные в БД: {:?}", game);
                    db::save_game(game, first_game.id as i32)?;
                }
            }
        }
    }

    Ok(games)
}


#[tauri::command]
pub async fn exchange_codes(code: String, redirect_uri: String) -> Result<String, String> {
    let response = exchange_code(code, redirect_uri).await?;
    Ok(serde_json::to_string(&response).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub async fn refresh_tokens(refresh_token: String) -> Result<String, String> {
    let response = get_refresh_token(refresh_token).await?;
    Ok(serde_json::to_string(&response).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub async fn get_user_profiles(access_token: String) -> Result<String, String> {
    get_user_profile(access_token).await
}

#[tauri::command]
pub async fn search_tracks(query: String, access_token: String) -> Result<String, String> {
    search_track(query, access_token).await
}

#[tauri::command]
pub async fn get_current_tracks(access_token: String) -> Result<String, String> {
    get_current_track(access_token).await
}

#[tauri::command]
pub async fn get_user_playlists(access_token: String) -> Result<String, String> {
    get_user_playlist(access_token).await
}

#[tauri::command]
pub async fn get_playlist_tracks(playlist_id: String, access_token: String) -> Result<String, String> {
    get_playlist_track(playlist_id, access_token).await
}

#[tauri::command]
pub async fn play_tracks(track_uri: String, client_id: String) -> Result<(), String> {
    // play_track(track_uri, client_id).await
    Err("SoundCloud API не поддерживает эту функцию.".to_string())
}

#[tauri::command]
pub async fn pause_playbacks(access_token: String) -> Result<(), String> {
    pause_playback(access_token).await
}

#[tauri::command]
pub async fn skip_tracks(access_token: String) -> Result<(), String> {
    skip_track(access_token).await
}

#[tauri::command]
pub async fn previous_tracks(access_token: String) -> Result<(), String> {
    previous_track(access_token).await
}

#[tauri::command]
pub async fn get_auth_url() -> String {
        get_authorize_url().await
}

#[tauri::command]
pub async fn auth_callback(code: String, redirect_uri: String) -> Result<String, String> {
    handle_auth_callback(code, redirect_uri).await
}

#[tauri::command]
pub async fn fetch_albums(access_token: String, album_ids: Vec<String>) -> Result<String, String> {
    fetch_albums_from_spotify(access_token, album_ids).await
}

#[command]
pub fn get_cpu_usage() -> f32 {
    // Пример использования библиотеки sysinfo для получения загрузки CPU
    use sysinfo::{System, SystemExt, CpuExt};
    let mut sys = System::new_all();
    sys.refresh_all();
    let cpu = sys.global_cpu_info();
    cpu.cpu_usage()
}

#[command]
pub fn get_memory_usage() -> (u64, u64) {
    use sysinfo::{System, SystemExt};
    let mut sys = System::new_all();
    sys.refresh_memory();
    (sys.used_memory(), sys.total_memory())
}

#[command]
pub fn enable_hotspot() -> Result<String, String> {
    // Пример: Включение хот-спота через netsh
    // Требуются права администратора
    let output = Command::new("netsh")
        .args(&["wlan", "set", "hostednetwork", "mode=allow", "ssid=MyHotspot", "key=MyPassword123"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        // Запуск хот-спота
        let start_output = Command::new("netsh")
            .args(&["wlan", "start", "hostednetwork"])
            .output()
            .map_err(|e| e.to_string())?;

        if start_output.status.success() {
            Ok("Хот-спот успешно включён.".to_string())
        } else {
            Err(String::from_utf8_lossy(&start_output.stderr).into_owned())
        }
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}

#[command]
pub fn disable_hotspot() -> Result<String, String> {
    // Остановка хот-спота
    let stop_output = Command::new("netsh")
        .args(&["wlan", "stop", "hostednetwork"])
        .output()
        .map_err(|e| e.to_string())?;

    if stop_output.status.success() {
        // Отключение режима хот-спота
        let disable_output = Command::new("netsh")
            .args(&["wlan", "set", "hostednetwork", "mode=disallow"])
            .output()
            .map_err(|e| e.to_string())?;

        if disable_output.status.success() {
            Ok("Хот-спот успешно отключён.".to_string())
        } else {
            Err(String::from_utf8_lossy(&disable_output.stderr).into_owned())
        }
    } else {
        Err(String::from_utf8_lossy(&stop_output.stderr).into_owned())
    }
}

/// Команда для проверки статуса хот-спота (Windows)
#[command]
pub fn get_hotspot_status() -> Result<bool, String> {
    // Получение текущего статуса хот-спота
    let output = Command::new("netsh")
        .args(&["wlan", "show", "hostednetwork"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        if stdout.contains("Status                 : Started") {
            Ok(true)
        } else {
            Ok(false)
        }
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}
/// Команда для перехода в спящий режим (Windows)
#[command]
pub fn sleep_mode() -> Result<String, String> {
    // Использование команды rundll32 для перехода в спящий режим
    let output = Command::new("rundll32")
        .args(&["powrprof.dll,SetSuspendState", "0,1,0"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Система переходит в спящий режим.".to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}

/// Команда для выключения системы (Windows)
#[command]
pub fn shutdown() -> Result<String, String> {

    // Использование команды shutdown для выключения системы
    let output = Command::new("shutdown")
        .args(&["/s", "/t", "0"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("Система выключается.".to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}


#[tauri::command]
pub fn get_links() -> Result<Vec<db::Link>, String> {
    db::get_links()
}

#[tauri::command]
pub fn add_links(name: String, icon: String, href: String, icon_color: String) -> Result<(), String> {
    println!("name: {}, icon: {}, href: {}, icon_color: {}", name, icon, href, icon_color);
    db::add_link(name, icon, href, icon_color)?;
    println!("Ссылка успешно добавлена:");
    Ok(())
}


#[command]
pub fn update_link(
    id: i64,
    name: String,
    icon: String,
    href: String,
    icon_color: String,
) -> Result<(), String> {
    db::update_link(id, name, icon, href, icon_color)
}

#[command]
pub fn delete_link(id: i64) -> Result<(), String> {
    db::delete_link(id)
}


#[tauri::command]
pub fn add_profiles(name: String, login: String, password: String, note: Option<String>) -> Result<(), String> {
    db::add_profile(&name, &login, &password, note.as_deref())
}

#[tauri::command]
pub fn update_profiles(id: i64, name: String, login: String, password: String, note: Option<String>) -> Result<(), String> {
    db::update_profile(id, &name, &login, &password, note.as_deref())
}

#[tauri::command]
pub fn delete_profiles(id: i64) -> Result<(), String> {
    db::delete_profile(id)
}

#[tauri::command]
pub fn get_profiles_command() -> Result<String, String> {
    let profiles = db::get_profiles()?; // Получение данных из базы
    serde_json::to_string(&profiles).map_err(|e| e.to_string()) // Конвертация в JSON
}


#[command]
pub fn add_note_command(title: String, content: String) -> Result<(), String> {
    db::add_note(&title, &content)
}

#[tauri::command]
pub fn get_notes_command() -> Result<Vec<db::Note>, String> {
    db::get_notes()
}


#[command]
pub fn update_note_command(id: i64, title: String, content: String) -> Result<(), String> {
    db::update_note(id, &title, &content)
}

#[command]
pub fn delete_note_command(id: i64) -> Result<(), String> {
    db::delete_note(id)
}
