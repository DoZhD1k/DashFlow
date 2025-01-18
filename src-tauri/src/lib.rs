pub mod utils {
    use chrono::Local;

    /// Логирует сообщение с текущим временем (для отладки).
    pub fn log_message(message: &str) {
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S");
        println!("[{timestamp}] {message}");
    }
}

pub mod db {
    use rusqlite::{Connection, Result};
    use std::path::PathBuf;

    /// Получаем путь к базе данных в текущей директории.
    pub fn get_db_path() -> PathBuf {
        std::env::current_dir().unwrap().join("projects.db")
    }

    /// Инициализируем базу данных.
    pub fn init_db() -> Result<Connection> {
        let db_path = get_db_path();
        let conn = Connection::open(db_path)?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                path TEXT NOT NULL,
                description TEXT
            )",
            [],
        )?;
        Ok(conn)
    }
}
