//db.rs
use rusqlite::{Connection, params, Result};
use serde::{Deserialize, Serialize};
use crate::games::DetectedGame;
use serde_json::to_string;
use rusqlite::OptionalExtension;
use std::path::PathBuf;
use std::{thread, time::Duration};

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

#[derive(Debug, Serialize, Deserialize)]
pub struct Link {
    pub id: i64, 
    pub name: String,
    pub icon: String,
    pub href: String,
    pub icon_color: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Profile {
    pub id: i64,         // ID профиля
    pub name: String,    // Имя профиля
    pub login: String,   // Логин
    pub password: String // Пароль
}


#[derive(Serialize, Deserialize)]
pub struct Note {
    id: i64,
    title: String,
    content: serde_json::Value, // JSON-объект для контента
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "updatedAt")]
    updated_at: String,
}

#[derive(Debug, serde::Serialize)]
pub struct Event {
    pub id: i64,                 // Уникальный идентификатор
    pub date: String,            // Дата события
    pub title: String,           // Название события
    pub description: String,     // Описание события
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HomeApp {
    pub id: i32,
    pub name: String,
    pub path: String,
}

/// Функция для получения пути к нужной базе данных
fn get_db_path(db_name: &str) -> PathBuf {
    std::env::current_dir().unwrap().join(format!("{}.db", db_name))
}

/// Открытие соединения с нужной БД
fn open_db(db_name: &str) -> Result<Connection> {
    Connection::open(get_db_path(db_name))
}

pub fn init_db() -> Result<Connection, String> {
    thread::sleep(Duration::from_secs(2));
    let conn = Connection::open("projects.db").map_err(|e| e.to_string())?;
    
    // Создание таблиц
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
    
    // Создание таблицы links
    conn.execute(
        "CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            href TEXT NOT NULL,
            icon_color TEXT NOT NULL DEFAULT '#000000'
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

     conn.execute(
        "CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            login TEXT NOT NULL,
            password TEXT NOT NULL,
            note TEXT
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    // Создание таблицы заметок
    conn.execute(
        "CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL, -- Храним JSON как строку
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS kanban_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT,
            col TEXT NOT NULL, -- Колонка: 'todo', 'inProgress', 'done' и т.д.
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    ).map_err(|e| format!("Failed to create kanban_tasks table: {}", e))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL, -- Дата в формате YYYY-MM-DD
            title TEXT NOT NULL, -- Заголовок события
            description TEXT -- Описание события
        )",
        [],
    )
    .map_err(|e| format!("Failed to create events table: {}", e))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS home_apps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL
        )",
        [],
    ).map_err(|e| e.to_string())?;    
    
    // Проверяем, существует ли столбец icon_color
    if !column_exists(&conn, "links", "icon_color") {
        // Добавляем столбец icon_color
        conn.execute(
            "ALTER TABLE links ADD COLUMN icon_color TEXT NOT NULL DEFAULT '#000000'",
            [],
        )
        .map_err(|e| {
            if e.to_string().contains("duplicate column name") {
                // Столбец уже существует, игнорируем ошибку
                e.to_string()
            } else {
                e.to_string()
            }
        })?;
    }
    
    Ok(conn) // Возвращаем соединение
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


pub fn get_links() -> Result<Vec<Link>, String> {
    let conn = init_db()?;
    let mut stmt = conn.prepare("SELECT id, name, icon, href, icon_color FROM links")
        .map_err(|e| e.to_string())?;

    let links_iter = stmt.query_map([], |row| {
        Ok(Link {
            id: row.get(0)?,
            name: row.get(1)?,
            icon: row.get(2)?,
            href: row.get(3)?,
            icon_color: row.get(4)?,
        })
    })
    .map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for link in links_iter {
        links.push(link.map_err(|e| e.to_string())?);
    }

    Ok(links)
}

pub fn add_link(name: String, icon: String, href: String, icon_color: String) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO links (name, icon, href, icon_color) VALUES (?1, ?2, ?3, ?4)",
        params![name, icon, href, icon_color],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

fn column_exists(conn: &Connection, table: &str, column: &str) -> bool {
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table)).unwrap();
    let column_info_iter = stmt.query_map([], |row| {
        let name: String = row.get(1)?;
        Ok(name)
    }).unwrap();

    for column_info in column_info_iter {
        if let Ok(col_name) = column_info {
            if col_name == column {
                return true;
            }
        }
    }
    false
}

pub fn update_link(
    id: i64,
    name: String,
    icon: String,
    href: String,
    icon_color: String,
) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE links SET name = ?1, icon = ?2, href = ?3, icon_color = ?4 WHERE id = ?5",
        params![name, icon, href, icon_color, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_link(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "DELETE FROM links WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}


// Добавление профиля
pub fn add_profile(name: &str, login: &str, password: &str, note: Option<&str>) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO profiles (name, login, password, note) VALUES (?1, ?2, ?3, ?4)",
        params![name, login, password, note],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

// Обновление профиля
pub fn update_profile(id: i64, name: &str, login: &str, password: &str, note: Option<&str>) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE profiles SET name = ?1, login = ?2, password = ?3, note = ?4 WHERE id = ?5",
        params![name, login, password, note, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

// Удаление профиля
pub fn delete_profile(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute("DELETE FROM profiles WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Получение всех профилей
pub fn get_profiles() -> Result<Vec<Profile>, String> {
    let conn = Connection::open("projects.db").map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, login, password FROM profiles")
        .map_err(|e| e.to_string())?;

    let profiles_iter = stmt
        .query_map([], |row| {
            Ok(Profile {
                id: row.get(0)?,
                name: row.get(1)?,
                login: row.get(2)?,
                password: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let profiles: Vec<Profile> = profiles_iter.collect::<Result<_, _>>().map_err(|e| e.to_string())?;
    Ok(profiles)
}


// Функции для работы с заметками
pub fn add_note(title: &str, content: &serde_json::Value) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO notes (title, content) VALUES (?, ?)",
        [
            title,
            &content.to_string(), // Сохраняем JSON как строку
        ],
    ).map_err(|e| format!("Failed to add note: {}", e))?;
    Ok(())
}


pub fn get_notes() -> Result<Vec<Note>, String> {
    let conn = init_db()?;
    let mut stmt = conn
        .prepare("SELECT id, title, content, created_at, updated_at FROM notes")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let notes_iter = stmt
        .query_map([], |row| {
            let content: String = row.get(2)?;
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content: serde_json::from_str(&content)
    .map_err(|e| rusqlite::Error::FromSqlConversionFailure(
        content.len(),
        rusqlite::types::Type::Text,
        Box::new(e),
    ))?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| format!("Failed to fetch notes: {}", e))?;

    let mut notes = Vec::new();
    for note in notes_iter {
        notes.push(note.map_err(|e| format!("Failed to parse note: {}", e))?);
    }
    Ok(notes)
}

pub fn update_note(id: i64, title: &str, content: &serde_json::Value) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [
            title,
            &content.to_string(), // Сохраняем JSON как строку
            &id.to_string(),
        ],
    ).map_err(|e| format!("Failed to update note: {}", e))?;
    Ok(())
}

pub fn delete_note(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute("DELETE FROM notes WHERE id = ?", [&id.to_string()])
        .map_err(|e| format!("Failed to delete note: {}", e))?;
    Ok(())
}

/// Добавляем новую задачу
pub fn kanban_add_task(
    title: &str,
    description: &str,
    date: Option<&str>,
    col: &str
) -> Result<i64, String> {
    let conn = init_db()?;
    println!("Добавляем задачу: title={}, description={}, date={:?}, col={}", title, description, date, col);

    conn.execute(
        "INSERT INTO kanban_tasks (title, description, date, col)
         VALUES (?1, ?2, ?3, ?4)",
        params![title, description, date, col],
    ).map_err(|e| {
        println!("Ошибка при вставке задачи: {}", e);
        format!("Failed to insert task: {}", e)
    })?;
    
    Ok(conn.last_insert_rowid())
}



/// Удаляем задачу
pub fn kanban_delete_task(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "DELETE FROM kanban_tasks WHERE id = ?1",
        [id],
    ).map_err(|e| format!("Failed to delete task: {}", e))?;
    Ok(())
}

/// Обновляем задачу
pub fn kanban_update_task(
    id: i64,
    title: &str,
    description: &str,
    date: Option<&str>,
    col: &str
) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE kanban_tasks
         SET title = ?1,
             description = ?2,
             date = ?3,
             col = ?4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?5",
        params![title, description, date, col, id],
    ).map_err(|e| format!("Failed to update task: {}", e))?;
    Ok(())
}

/// Получаем список всех задач (вернём вектор кортежей)
pub fn kanban_list_tasks() -> Result<Vec<(i64, String, String, Option<String>, String, String, String)>, String> {
    let conn = init_db()?;

    let mut stmt = conn.prepare(
        "SELECT id, title, description, date, col, created_at, updated_at
         FROM kanban_tasks"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([], |row| {
        Ok((
            row.get::<_, i64>(0)?,            // id
            row.get::<_, String>(1)?,        // title
            row.get::<_, String>(2)?,        // description
            row.get::<_, Option<String>>(3)?,// date
            row.get::<_, String>(4)?,        // col
            row.get::<_, String>(5)?,        // created_at
            row.get::<_, String>(6)?,        // updated_at
        ))
    }).map_err(|e| format!("Failed to query tasks: {}", e))?;

    let mut results = Vec::new();
    for row_result in rows {
        let row_tuple = row_result.map_err(|e| e.to_string())?;
        results.push(row_tuple);
    }

    Ok(results)
}

/// Добавить новое событие
pub fn add_event(date: &str, title: &str, description: &str) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO events (date, title, description) VALUES (?1, ?2, ?3)",
        params![date, title, description],
    )
    .map_err(|e| format!("Failed to insert event: {}", e))?;
    Ok(())
}

/// Получить события по дате
pub fn get_events_by_date(date: &str) -> Result<Vec<Event>, String> {
    let conn = init_db()?;
    let mut stmt = conn
        .prepare("SELECT id, date, title, description FROM events WHERE date = ?1")
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let rows = stmt
        .query_map([date], |row| {
            Ok(Event {
                id: row.get(0)?,
                date: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
            })
        })
        .map_err(|e| format!("Failed to query events: {}", e))?;

    let mut events = Vec::new();
    for event in rows {
        events.push(event.map_err(|e| e.to_string())?);
    }
    Ok(events)
}

/// Удалить событие
pub fn delete_event(id: i64) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute("DELETE FROM events WHERE id = ?1", params![id])
        .map_err(|e| format!("Failed to delete event: {}", e))?;
    Ok(())
}


/// Обновить событие
pub fn update_event(id: i64, title: &str, description: &str) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute(
        "UPDATE events SET title = ?1, description = ?2 WHERE id = ?3",
        params![title, description, id],
    )
    .map_err(|e| format!("Failed to update event: {}", e))?;
    Ok(())
}



// Функция для добавления нового приложения
pub fn add_home_apps(name: String, path: String) -> Result<i64, String> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO home_apps (name, path) VALUES (?1, ?2)",
        params![name, path],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

// Функция для получения всех приложений
pub fn get_home_apps() -> Result<Vec<HomeApp>, String> {
    let conn = init_db()?;
    let mut stmt = conn
        .prepare("SELECT id, name, path FROM home_apps")
        .map_err(|e| e.to_string())?;
    
    let apps = stmt
        .query_map([], |row| {
            Ok(HomeApp {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(apps)
}

// Функция для удаления приложения
pub fn delete_home_app(id: i32) -> Result<(), String> {
    let conn = init_db()?;
    conn.execute("DELETE FROM home_apps WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Функция для запуска приложения
#[cfg(target_os = "windows")]
pub fn launch_home_app(path: String) -> Result<(), String> {
    use std::process::Command;
    Command::new("cmd")
        .args(["/C", &path])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}


pub fn drop_table() -> Result<String, String> {
    let conn = init_db()?;
    conn.execute("DROP TABLE IF EXISTS games", []).map_err(|e| e.to_string())?;
    Ok("Таблица games успешно удалена.".to_string())
}