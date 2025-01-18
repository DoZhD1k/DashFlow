use tauri::command;
use std::process::Command;
use log::info;
use crate::games::{detection, rawg};
use crate::games::DetectedGame;
use crate::db;

use reqwest::Client;
use serde_json::Value;

const JAMENDO_API_URL: &str = "https://api.jamendo.com/v3.0";
struct JamendoConfig {
    client_id: String,
    janemdo_api_key: String,
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


#[command]
pub async fn search_tracks(query: String, jamendo_api_key: tauri::State<'_, String>) -> Result<Value, String> {
    let client = Client::new();
    let url = "https://api.jamendo.com/v3.0/tracks";

    let response = client
        .get(url)
        .query(&[
            ("client_id", jamendo_api_key.as_str()),
            ("format", "json"),
            ("limit", "10"),
            ("search", &query),
        ])
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    if response.status().is_success() {
        let data: Value = response
            .json()
            .await
            .map_err(|e| format!("Ошибка декодирования ответа: {}", e))?;
        Ok(data)
    } else {
        Err(format!(
            "Ошибка API Jamendo: статус {}",
            response.status()
        ))
    }
}