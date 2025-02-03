use reqwest;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use reqwest::Client;


#[derive(Serialize, Deserialize, Debug)]
pub struct Artwork {
    #[serde(rename = "150x150")]
    pub small: Option<String>,
    #[serde(rename = "480x480")]
    pub medium: Option<String>,
    #[serde(rename = "1000x1000")]
    pub large: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Track {
    pub id: String,
    pub title: String,
    #[serde(rename = "user")]
    pub artist_info: Artist,
    pub duration: u32,
    pub stream_url: String,
    pub artwork: Option<Artwork>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Playlist {
    pub id: String,
    pub playlist_name: String,
    pub description: Option<String>,
    pub artwork: Option<Artwork>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Artist {
    pub name: String,
}

const BASE_URL: &str = "https://dn1.monophonic.digital";
const APP_NAME: &str = "dashflow";

pub async fn search_tracks_audius(query: String) -> Result<Value, String> {
    let client = Client::new();
    let url = format!(
        "{}/v1/tracks/search?query={}&app_name={}",
        BASE_URL, query, APP_NAME
    );

    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(err) => Err(format!("Ошибка парсинга JSON: {:?}", err)),
        },
        Err(err) => Err(format!("Ошибка выполнения запроса: {:?}", err)),
    }
}

pub async fn search_playlists_audius(query: String) -> Result<Value, String> {
    let client = Client::new();
    let url = format!(
        "{}/v1/playlists/search?query={}&app_name={}",
        BASE_URL, query, APP_NAME
    );

    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(err) => Err(format!("Ошибка парсинга JSON: {:?}", err)),
        },
        Err(err) => Err(format!("Ошибка выполнения запроса: {:?}", err)),
    }
}

pub async fn get_playlist_tracks_audius(playlist_id: String) -> Result<Value, String> {
    let client = Client::new();
    let url = format!(
        "{}/v1/playlists/{}/tracks?app_name={}",
        BASE_URL, playlist_id, APP_NAME
    );

    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(err) => Err(format!("Ошибка парсинга JSON: {:?}", err)),
        },
        Err(err) => Err(format!("Ошибка выполнения запроса: {:?}", err)),
    }
}

pub async fn get_track_stream_url(track_id: String) -> Result<String, String> {
    let client = Client::new();
    let url = format!("{}/v1/tracks/{}/stream?app_name={}", BASE_URL, track_id, APP_NAME);

    match client.get(&url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                Ok(url)
            } else {
                Err(format!("Ошибка получения стрим-URL: {}", response.status()))
            }
        },
        Err(err) => Err(format!("Ошибка выполнения запроса: {:?}", err)),
    }
}

#[tauri::command]
pub async fn get_trending_tracks(genre: Option<String>) -> Result<serde_json::Value, String> {
    let base_url = format!("{}/v1/tracks/trending?app_name={}", BASE_URL, APP_NAME);
    let url = if let Some(g) = genre {
        format!("{}?genre={}&app_name=dashflow", base_url, g)
    } else {
        format!("{}?app_name=dashflow", base_url)
    };

    println!("📡 Запрос трендов: {}", url); // Логируем URL перед запросом

    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("Ошибка запроса: {}", e))?;

    let text = response.text().await.map_err(|e| format!("Ошибка чтения ответа: {}", e))?;

    println!("📥 Полученный ответ: {}", text); // Логируем JSON перед парсингом

    let json: serde_json::Value = serde_json::from_str(&text)
        .map_err(|e| format!("Ошибка обработки JSON: {}", e))?;

    Ok(json)
}

