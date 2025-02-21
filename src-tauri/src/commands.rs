// commands.rs
use tauri::command;
use std::process::Command;
use log::info;
use crate::games::{detection, rawg};
use crate::games::DetectedGame;
use crate::db;
use std::fs::{create_dir_all, File};
use std::io::Write;
use dirs_next::home_dir;
use sysinfo::{ System, SystemExt};
use crate::music::audius::{
    search_tracks_audius,
    search_playlists_audius,
    get_playlist_tracks_audius,
    get_track_stream_url, get_trending_tracks,
};
use reqwest::Client;
use serde_json::json;
use serde_json::Value;
use std::env;


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
pub async fn scan_and_fetch_games() -> Result<Vec<DetectedGame>, String> {
    let rawg_api_key = env::var("RAWG_API_KEY").unwrap_or_else(|_| "NO_API_KEY".to_string());
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
        if let Some(rawg_games) = rawg::fetch_games(&client, &rawg_api_key, game_name_ref)
            .await
            .ok()
        {
            if let Some(first_game) = rawg_games.get(0) {
                println!("Данные из RAWG API для '{}': {:?}", game_name_ref, first_game);

                // Получаем детальную информацию об игре
                if let Some(details) =
                    rawg::fetch_game_details(&client, &rawg_api_key, first_game.id).await.ok()
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

/// Команда для поиска треков
#[command]
pub async fn search_tracks_audius_command(query: String) -> Result<Value, String> {
    search_tracks_audius(query).await
}

#[command]
pub async fn search_playlists_audius_command(query: String) -> Result<Value, String> {
    search_playlists_audius(query).await
}

#[command]
pub async fn get_playlist_tracks_audius_command(playlist_id: String) -> Result<Value, String> {
    get_playlist_tracks_audius(playlist_id).await
}

#[command]
pub async fn get_track_stream_url_command(track_id: String) -> Result<String, String> {
    get_track_stream_url(track_id).await
}

#[command]
pub async fn get_trending_tracks_command(genre: Option<String>) -> Result<Value, String> {
    get_trending_tracks(genre).await
}



#[tauri::command]
pub fn get_cpu_usage() -> f32 {
    use std::{thread, time::Duration};
    use sysinfo::{CpuExt, System, SystemExt};

    // Создаем новый объект System и получаем первоначальные данные
    let mut sys = System::new_all();
    sys.refresh_cpu();

    // Подождем немного, чтобы получить разницу между обновлениями
    thread::sleep(Duration::from_millis(200));

    // Обновляем данные по CPU повторно
    sys.refresh_cpu();

    // Возвращаем рассчитанное значение загрузки CPU
    sys.global_cpu_info().cpu_usage()
}

#[tauri::command]
pub fn get_battery_info() -> Result<(f32, f32), String> {
    use battery::Manager;

    // Создаем менеджер батарей
    let manager = Manager::new().map_err(|e| e.to_string())?;
    let mut batteries = manager.batteries().map_err(|e| e.to_string())?;

    if let Some(battery_result) = batteries.next() {
        let battery = battery_result.map_err(|e| e.to_string())?;
        // state_of_charge() возвращает значение от 0.0 до 1.0, умножаем на 100 для процента
        let percentage = battery.state_of_charge().value * 100.0;
        // Время до разряда (в секундах) или 0, если значение недоступно
let time_to_empty = battery
    .time_to_empty()
    .map(|d| d.get::<battery::units::time::second>())
    .unwrap_or(0.0);        Ok((percentage, time_to_empty))
    } else {
        Err("Батарея не обнаружена".into())
    }
}

#[tauri::command]
pub fn get_memory_usage() -> (u64, u64) {
    let mut sys = System::new();
    sys.refresh_memory(); // Обновляем только память
    (sys.used_memory(), sys.total_memory())
}

#[tauri::command]
pub fn get_process_count() -> usize {
    let mut sys = System::new();
    sys.refresh_processes();
    sys.processes().len()
}
#[tauri::command]
pub fn get_uptime() -> u64 {
    let mut sys = System::new();
    sys.refresh_system();
    sys.uptime() // время работы в секундах
}

#[tauri::command]
pub fn restart() -> Result<String, String> {
    let output = Command::new("shutdown")
        .args(&["/r", "/t", "0"])
        .output()
        .map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok("Система перезагружается.".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}

#[tauri::command]
pub fn open_task_manager() -> Result<String, String> {
    // Запускаем PowerShell, который в свою очередь запускает taskmgr с повышенными привилегиями.
    // Это приведёт к появлению запроса UAC.
    Command::new("powershell")
        .args(&["-Command", "Start-Process", "taskmgr", "-Verb", "runAs"])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok("Диспетчер задач открыт.".into())
}

#[tauri::command]
pub fn open_settings() -> Result<String, String> {
    // Открываем настройки Windows через ms-settings:
    Command::new("cmd")
        .args(&["/c", "start", "ms-settings:"])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok("Настройки Windows открыты.".into())
}

#[tauri::command]
pub fn open_explorer() -> Result<String, String> {
    // Открываем проводник
    Command::new("explorer")
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok("Проводник открыт.".into())
}

#[tauri::command]
pub fn lock() -> Result<String, String> {
    let output = Command::new("rundll32.exe")
        .args(&["user32.dll,LockWorkStation"])
        .output()
        .map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok("Экран заблокирован.".into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}

#[tauri::command]
pub fn sleep_mode() -> Result<String, String> {
    // Попытка перевода системы в спящий режим без параметров
    let output = Command::new("rundll32")
        .args(&["powrprof.dll,SetSuspendState", "Sleep"])
        .output()
        .map_err(|e| format!("Ошибка запуска команды: {}", e))?;

    if output.status.success() {
        Ok("Система переходит в спящий режим.".into())
    } else {
        Err(format!(
            "Ошибка перехода в спящий режим: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}


#[tauri::command]
pub fn shutdown() -> Result<String, String> {
    // Использование shutdown для выключения системы
    let output = Command::new("shutdown")
        .args(&["/s", "/t", "0"])
        .output()
        .map_err(|e| format!("Ошибка запуска команды: {}", e))?;

    if output.status.success() {
        Ok("Система выключается.".into())
    } else {
        Err(format!(
            "Ошибка выключения системы: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
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


#[tauri::command]
pub fn add_note_command(title: String, content: serde_json::Value) -> Result<(), String> {
    db::add_note(&title, &content)
}

#[tauri::command]
pub fn get_notes_command() -> Result<Vec<db::Note>, String> {
    db::get_notes()
}

#[tauri::command]
pub fn update_note_command(id: i64, title: String, content: serde_json::Value) -> Result<(), String> {
    db::update_note(id, &title, &content)
}

#[tauri::command]
pub fn delete_note_command(id: i64) -> Result<(), String> {
    db::delete_note(id)
}



#[tauri::command]
pub fn kanban_add_task_command(
    title: String,
    description: String,
    date: Option<String>,
    col: String
) -> Result<i64, String> {
    println!(
        "Получено с фронта: title={}, description={}, date={:?}, col={}",
        title, description, date, col
    );

    if title.trim().is_empty() {
        return Err("Название задачи не может быть пустым.".to_string());
    }
    db::kanban_add_task(&title, &description, date.as_deref(), &col)
}

#[tauri::command]
pub fn kanban_delete_task_command(id: i64) -> Result<(), String> {
    db::kanban_delete_task(id)
}

#[tauri::command]
pub fn kanban_update_task_command(
    id: i64,
    title: String,
    description: String,
    date: Option<String>,
    col: String
) -> Result<(), String> {
    db::kanban_update_task(id, &title, &description, date.as_deref(), &col)
}


/// Возвращаем список задач (в виде массива кортежей)
#[tauri::command]
pub fn kanban_list_tasks_command()
    -> Result<Vec<(i64, String, String, Option<String>, String, String, String)>, String>
{
    println!("Запрашиваем задачи...");
    let tasks = db::kanban_list_tasks()?;
    println!("Полученные задачи: {:?}", tasks);
    Ok(tasks)
}




#[tauri::command]
pub fn add_event_command(date: String, title: String, description: String) -> Result<(), String> {
    db::add_event(&date, &title, &description)
}


#[tauri::command]
pub fn get_events_by_date_command(date: String) -> Result<Vec<db::Event>, String> {
    db::get_events_by_date(&date)
}

#[tauri::command]
pub fn delete_event_command(id: i64) -> Result<(), String> {
    db::delete_event(id)
}

#[tauri::command]
pub fn update_event_command(id: i64, title: String, description: String) -> Result<(), String> {
    db::update_event(id, &title, &description)
}

#[tauri::command]
pub async fn complete_text(prompt: String) -> Result<String, String> {
    let gemini_api_key = std::env::var("GEMINI_API_KEY")
        .expect("GEMINI_API_KEY must be set in .env");

    let api_url = format!(
        "https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateContent?key={}",
        gemini_api_key
    );

    println!("Получен запрос на генерацию текста. Prompt: {}", prompt);

    let client = Client::new();
    let response = client
        .post(&api_url)
        .header("Content-Type", "application/json")
        .json(&json!({
            "prompt": {
                "text": prompt
            },
            "temperature": 0.7,
            "candidateCount": 1
        }))
        .send()
        .await;

    match response {
        Ok(resp) => {
            // Сохраняем статус
            let status = resp.status();

            // Считываем тело ответа перед повторным использованием resp
            let body = resp.text().await.unwrap_or_else(|_| "Пустой ответ".to_string());
            println!("Ответ от сервера: {}", body);

            if status != 200 {
                return Err(format!("Ошибка: Статус ответа {}. Тело: {}", status, body));
            }

            // Парсим JSON
            let json_response: serde_json::Value = match serde_json::from_str(&body) {
                Ok(json) => json,
                Err(e) => {
                    println!("Ошибка парсинга JSON ответа: {}", e);
                    return Err("Ошибка парсинга ответа от сервера".to_string());
                }
            };

            // Извлекаем результат генерации текста
            if let Some(generated_text) = json_response["candidates"]
                .as_array()
                .and_then(|candidates| candidates.get(0))
                .and_then(|candidate| candidate["output"].as_str())
            {
                println!("Сгенерированный текст: {}", generated_text);
                Ok(generated_text.to_string())
            } else {
                println!("Ошибка: Ответ не содержит сгенерированного текста.");
                Err("Ответ не содержит сгенерированного текста.".to_string())
            }
        }
        Err(err) => {
            println!("Ошибка при отправке запроса: {}", err);
            Err("Ошибка запроса к API".to_string())
        }
    }
}


#[command]
pub fn add_home_apps(name: String, path: String) -> Result<i64, String> {
    db::add_home_apps(name, path)
}

// Получение списка приложений
#[command]
pub fn get_home_apps() -> Result<Vec<db::HomeApp>, String> {
    db::get_home_apps()
}

// Удаление приложения
#[command]
pub fn delete_home_app(id: i32) -> Result<(), String> {
    db::delete_home_app(id)
}

// Запуск приложения
#[command]
pub fn launch_home_app(path: String) -> Result<(), String> {
    db::launch_home_app(path)
}

#[tauri::command]
pub fn open_dashflow_folder() -> Result<(), String> {
    let home_dir = home_dir().ok_or("Не удалось получить домашнюю директорию")?;
    let folder_path = home_dir.join("DashFlowVid");

    if !folder_path.exists() {
        return Err("Папка DashFlowVid не найдена".to_string());
    }

    #[cfg(target_os = "windows")]
    let cmd = Command::new("explorer").arg(folder_path).spawn();

    #[cfg(target_os = "macos")]
    let cmd = Command::new("open").arg(folder_path).spawn();

    #[cfg(target_os = "linux")]
    let cmd = Command::new("xdg-open").arg(folder_path).spawn();

    match cmd {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Ошибка открытия папки: {}", e)),
    }
}

#[tauri::command]
pub fn save_video(video_data: Vec<u8>) -> Result<String, String> {
    let home = home_dir().ok_or("Не удалось получить домашнюю директорию")?;
    let folder_path = home.join("DashFlowVid");

    // ✅ Создаём папку, если её нет
    if !folder_path.exists() {
        create_dir_all(&folder_path).map_err(|e| format!("Ошибка создания папки: {}", e))?;
    }

    // ✅ Формируем путь к файлу
    let filename = format!("recording-{}.webm", chrono::Local::now().format("%Y-%m-%d_%H-%M-%S"));
    let file_path = folder_path.join(filename);

    // ✅ Записываем файл
    let mut file = File::create(&file_path).map_err(|e| format!("Ошибка создания файла: {}", e))?;
    file.write_all(&video_data).map_err(|e| format!("Ошибка записи файла: {}", e))?;

    Ok(file_path.to_string_lossy().to_string()) // ✅ Возвращаем путь
}


#[tauri::command]
pub fn drop_games_table() -> Result<String, String> {
    db::drop_table()
}

#[tauri::command]
pub fn load_db() -> Result<(), String> {
    let conn = db::init_db()?;
    println!("✅ База данных загружена!");
    Ok(())
}