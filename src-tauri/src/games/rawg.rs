use reqwest::Client;
use serde::Deserialize;
use crate::games::DetectedGame;

const RAWG_API_URL: &str = "https://api.rawg.io/api/games";

#[derive(Deserialize, Debug)]
pub struct Game {
    pub id: u32,
    pub name: String,
    pub released: Option<String>,
    pub background_image: Option<String>,
    pub rating: f32,
    pub description_raw: Option<String>, // Описание
    pub genres: Option<Vec<Genre>>,      // Жанры
    pub developers: Option<Vec<Developer>>, // Разработчики
    pub platforms: Option<Vec<PlatformInfo>>, // Платформы
}

#[derive(Deserialize, Debug)]
pub struct Genre {
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct Developer {
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct PlatformInfo {
    pub platform: Platform,
}

#[derive(Deserialize, Debug)]
pub struct Platform {
    pub name: String,
}

#[derive(Deserialize, Debug)]
struct GamesResponse {
    results: Vec<Game>,
}

pub fn create_client() -> Client {
    Client::new()
}

impl From<Game> for DetectedGame {
    fn from(rawg_game: Game) -> Self {
        DetectedGame {
            name: rawg_game.name,
            description: rawg_game.description_raw,
            path: None, // Локальный путь из RAWG API отсутствует
            platform: "RAWG".to_string(), // Можно указать источник данных
            url: Some(format!("https://rawg.io/games/{}", rawg_game.id)),
            cover: rawg_game.background_image,
            genres: rawg_game
                .genres
                .map(|g| g.into_iter().map(|genre| genre.name).collect()),
            developers: rawg_game
                .developers
                .map(|d| d.into_iter().map(|dev| dev.name).collect()),
            platforms: rawg_game
                .platforms
                .map(|p| p.into_iter().map(|p| p.platform.name).collect()),
        }
    }
}

pub async fn fetch_games(client: &Client, api_key: &str, query: &str) -> Result<Vec<Game>, String> {
    let response = client
        .get(RAWG_API_URL)
        .query(&[("key", api_key), ("search", query)])
        .send()
        .await
        .map_err(|e| format!("Ошибка при запросе: {}", e))?;

    if response.status().is_success() {
        let games_response: GamesResponse = response
            .json()
            .await
            .map_err(|e| format!("Ошибка парсинга JSON: {}", e))?;
        Ok(games_response.results)
    } else {
        Err(format!("Ошибка API RAWG: статус {}", response.status()))
    }
}

pub async fn fetch_game_details(client: &Client, api_key: &str, game_id: u32) -> Result<Game, String> {
    let url = format!("{}/{}", RAWG_API_URL, game_id);
    let response = client
        .get(&url)
        .query(&[("key", api_key)])
        .send()
        .await
        .map_err(|e| format!("Ошибка при запросе: {}", e))?;

    if response.status().is_success() {
        let game: Game = response
            .json()
            .await
            .map_err(|e| format!("Ошибка парсинга JSON: {}", e))?;
        Ok(game)
    } else {
        Err(format!("Ошибка API RAWG: статус {}", response.status()))
    }
}
