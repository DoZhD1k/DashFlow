use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TokenResponse {
    access_token: String, // SoundCloud не требует отдельного access_token
    token_type: String,
    expires_in: Option<i64>, // Удалено для SoundCloud
    refresh_token: Option<String>, // Удалено для SoundCloud
    scope: Option<String>, // Удалено для SoundCloud
}

/// Заменяем URL для SoundCloud и возвращаем пустой токен
#[tauri::command]
pub async fn exchange_code(_code: String, _redirect_uri: String) -> Result<TokenResponse, String> {
    Ok(TokenResponse {
        access_token: String::new(),
        token_type: "none".to_string(),
        expires_in: None,
        refresh_token: None,
        scope: None,
    })
}

/// У SoundCloud нет обновления токена
#[tauri::command]
pub async fn get_refresh_token(_refresh_token: String) -> Result<TokenResponse, String> {
    Err("SoundCloud API не поддерживает обновление токенов.".to_string())
}

/// Поиск трека
pub async fn search_track(query: String, client_id: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://api.soundcloud.com/tracks?q={}&client_id={}",
        query, client_id
    );

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    if response.status().is_success() {
        let data = response.text().await.map_err(|e| format!("Ошибка чтения ответа: {}", e))?;
        Ok(data)
    } else {
        Err(format!(
            "Ошибка: {}",
            response.text().await.unwrap_or_else(|_| "Не удалось получить ответ".to_string())
        ))
    }
}

/// Получение текущего трека
pub async fn get_current_track(_access_token: String) -> Result<String, String> {
    Err("SoundCloud API не поддерживает эту функцию.".to_string())
}

/// Получение профиля пользователя
#[tauri::command]
pub async fn get_user_profile(_access_token: String) -> Result<String, String> {
    Err("SoundCloud API не поддерживает получение данных профиля.".to_string())
}

/// Получение плейлистов пользователя
#[tauri::command]
pub async fn get_user_playlist(client_id: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://api.soundcloud.com/playlists?client_id={}",
        client_id
    );

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    if response.status().is_success() {
        let data = response
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения ответа: {}", e))?;
        Ok(data)
    } else {
        Err(format!(
            "Ошибка: {}",
            response.text().await.unwrap_or_else(|_| "Не удалось получить ответ".to_string())
        ))
    }
}

/// Получение треков из плейлиста
#[tauri::command]
pub async fn get_playlist_track(playlist_id: String, client_id: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://api.soundcloud.com/playlists/{}/tracks?client_id={}",
        playlist_id, client_id
    );

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    if response.status().is_success() {
        let data = response
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения ответа: {}", e))?;
        Ok(data)
    } else {
        Err(format!(
            "Ошибка: {}",
            response.text().await.unwrap_or_else(|_| "Не удалось получить ответ".to_string())
        ))
    }
}

/// Воспроизведение трека (заменяем на получение прямой ссылки на трек)
#[tauri::command]
pub async fn play_track(track_uri: String, client_id: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://api.soundcloud.com/resolve?url={}&client_id={}",
        track_uri, client_id
    );

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    if response.status().is_success() {
        let data = response
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения ответа: {}", e))?;
        Ok(data)
    } else {
        Err(format!(
            "Ошибка: {}",
            response.text().await.unwrap_or_else(|_| "Не удалось получить ответ".to_string())
        ))
    }
}

/// Pause/Resume - не поддерживается
#[tauri::command]
pub async fn pause_playback(_access_token: String) -> Result<(), String> {
    Err("SoundCloud API не поддерживает управление воспроизведением.".to_string())
}

/// Skip - не поддерживается
#[tauri::command]
pub async fn skip_track(_access_token: String) -> Result<(), String> {
    Err("SoundCloud API не поддерживает эту функцию.".to_string())
}

/// Previous - не поддерживается
#[tauri::command]
pub async fn previous_track(_access_token: String) -> Result<(), String> {
    Err("SoundCloud API не поддерживает эту функцию.".to_string())
}

/// Авторизация для SoundCloud
#[tauri::command]
pub async fn get_authorize_url() -> String {
    format!("SoundCloud не требует явной авторизации через API.")
}

/// Обработка колбэка авторизации - заменяем на фиктивный ответ
#[tauri::command]
pub async fn handle_auth_callback(_code: String, _redirect_uri: String) -> Result<String, String> {
    Ok("SoundCloud не требует явной авторизации.".to_string())
}

/// Загрузка альбомов заменяется на треки или плейлисты
#[tauri::command]
pub async fn fetch_albums_from_spotify(client_id: String, _album_ids: Vec<String>) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!("https://api.soundcloud.com/playlists?client_id={}", client_id);

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    let body = response
        .text()
        .await
        .map_err(|e| format!("Ошибка чтения ответа: {}", e))?;

    Ok(body)
}
