use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use crate::games::DetectedGame;
use serde_json::to_string;
use rusqlite::OptionalExtension;

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub path: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Todo {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub completed: bool,
}

pub fn init_db() -> Result<Connection, String> {
    let conn = Connection::open("projects.db").map_err(|e| e.to_string())?;
    // let conn = Connection::open("/data/db.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            description TEXT
        )",
        [],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0
        )",
        [],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rawg_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            path TEXT,
            platform TEXT,
            url TEXT,
            cover TEXT,
            genres TEXT,
            developers TEXT,
            platforms TEXT
        )",
        [],
    ).map_err(|e| e.to_string())?;
    Ok(conn)
}

pub fn add_project(name: String, path: String, description: String) -> Result<i64, String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO projects (name, path, description) VALUES (?1, ?2, ?3)",
        params![name, path, description],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

pub fn fetch_projects() -> Result<Vec<Project>, String> {
    let conn = init_db()?;
    let mut stmt = conn
        .prepare("SELECT id, name, path, description FROM projects")
        .map_err(|e| e.to_string())?;
    let projects = stmt
        .query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
                description: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(projects)
}

pub fn add_todo(title: String, description: String) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO todos (title, description, completed) VALUES (?1, ?2, 0)",
        params![title, description],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn fetch_todos() -> Result<Vec<Todo>, String> {
    let conn = init_db()?;
    let mut stmt = conn
        .prepare("SELECT id, title, description, completed FROM todos")
        .map_err(|e| e.to_string())?;
    let todos = stmt
        .query_map([], |row| {
            Ok(Todo {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                completed: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(todos)
}

pub fn update_todo(id: i64, completed: bool) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE todos SET completed = ?1 WHERE id = ?2",
        params![completed, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_todo(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "DELETE FROM todos WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn save_game(game: &DetectedGame, rawg_id: i32) -> Result<(), String> {
    let genres = to_string(&game.genres).unwrap_or_default();
    let developers = to_string(&game.developers).unwrap_or_default();
    let platforms = to_string(&game.platforms).unwrap_or_default();
    let conn = init_db()?;

    // Отладочное сообщение перед записью
    println!(
        "Сохранение данных в БД: rawg_id: {}, name: {}, description: {:?}, path: {:?}, platform: {}, url: {:?}, cover: {:?}, genres: {:?}, developers: {:?}, platforms: {:?}",
        rawg_id, game.name, game.description, game.path, game.platform, game.url, game.cover, game.genres, game.developers, game.platforms
    );

    conn.execute(
        "INSERT INTO games (rawg_id, name, description, path, platform, url, cover, genres, developers, platforms)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
         ON CONFLICT(rawg_id) DO UPDATE SET
             name = excluded.name,
             description = excluded.description,
             path = excluded.path,
             platform = excluded.platform,
             url = excluded.url,
             cover = excluded.cover,
             genres = excluded.genres,
             developers = excluded.developers,
             platforms = excluded.platforms",
        params![
            rawg_id,
            game.name,
            game.description,
            game.path,
            game.platform,
            game.url,
            game.cover,
            genres,
            developers,
            platforms
        ],
    )
    .map_err(|e| {
        println!("Ошибка записи в БД: {}", e); // Лог ошибки
        e.to_string()
    })?;

    println!("Данные успешно сохранены в БД: rawg_id: {}", rawg_id); // Лог успешной записи
    Ok(())
}


pub fn get_game_by_name(
    conn: &rusqlite::Connection,
    name: &str,
) -> Result<Option<DetectedGame>, String> {
    println!("Попытка извлечь игру из БД с именем: {}", name); // Лог перед запросом

    let mut stmt = conn
        .prepare("SELECT rawg_id, name, description, path, platform, url, cover, genres, developers, platforms FROM games WHERE name = ?1")
        .map_err(|e| {
            println!("Ошибка подготовки запроса: {}", e); // Лог ошибки подготовки
            format!("Ошибка подготовки запроса: {}", e)
        })?;
    
    let game = stmt
        .query_row([name], |row| {
            Ok(DetectedGame {
                name: row.get(1).unwrap_or_default(),
                description: row.get(2).ok(),
                path: row.get(3).ok(),
                platform: row.get(4).unwrap_or_default(),
                url: row.get(5).ok(),
                cover: row.get(6).ok(),
                genres: serde_json::from_str(&row.get::<_, String>(7).unwrap_or_default()).unwrap_or_default(),
                developers: serde_json::from_str(&row.get::<_, String>(8).unwrap_or_default()).unwrap_or_default(),
                platforms: serde_json::from_str(&row.get::<_, String>(9).unwrap_or_default()).unwrap_or_default(),
            })
        })
        .optional()
        .map_err(|e| {
            println!("Ошибка выполнения запроса: {}", e); // Лог ошибки выполнения
            format!("Ошибка выполнения запроса: {}", e)
        })?;

    if let Some(ref game_data) = game {
        println!("Извлечены данные из БД: {:?}", game_data); // Лог успешного извлечения
    } else {
        println!("Игра с именем '{}' не найдена в БД.", name); // Лог, если данные не найдены
    }

    Ok(game)
}
