// src-tauri/src/games/mod.rs
pub mod detection;
pub mod rawg;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DetectedGame {
    pub name: String,                     // Название игры
    pub description: Option<String>,      // Описание игры
    pub path: Option<String>,             // Локальный путь к файлу
    pub platform: String,                 // Платформа (Steam, Epic и т.д.)
    pub url: Option<String>,              // Ссылка на страницу игры в RAWG
    pub cover: Option<String>,            // Обложка игры
    pub genres: Option<Vec<String>>,      // Жанры игры
    pub developers: Option<Vec<String>>,  // Разработчики
    pub platforms: Option<Vec<String>>,   // Платформы
}
