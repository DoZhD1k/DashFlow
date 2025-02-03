// src-tauri/src/games/detection.rs

use std::path::PathBuf;
use walkdir::WalkDir;
use std::path::Path;
use std::fs;
use sysinfo::{System, SystemExt, DiskExt};
use log::{info, debug, warn};


use crate::games::DetectedGame;

struct LauncherConfig {
    name: String,
    config_path: Option<PathBuf>, 
    default_dirs: Vec<PathBuf>,   
    platform: String,             
}

fn find_steam_config() -> Option<PathBuf> {
    let mut system = System::new_all();
    system.refresh_disks_list();

    for disk in system.disks() {
        let potential_path = disk.mount_point().join("Steam/config/libraryfolders.vdf");
        if potential_path.exists() {
            println!("Найден Steam config: {}", potential_path.display());
            return Some(potential_path);
        }
    }

    None
}

fn get_launchers() -> Vec<LauncherConfig> {
    let steam_config = find_steam_config(); 
    vec![
        LauncherConfig {
            name: "Steam".to_string(),
            config_path: steam_config,
            default_dirs: vec![], 
            platform: "Steam".to_string(),
        },
        LauncherConfig {
            name: "Epic Games".to_string(),
            config_path: None, 
            default_dirs: vec![
                PathBuf::from("C:/Program Files/Epic Games"),
            ],
            platform: "Epic Games".to_string(),
        },
        LauncherConfig {
            name: "GOG".to_string(),
            config_path: None,
            default_dirs: vec![
                PathBuf::from("C:/Program Files (x86)/GOG Galaxy/Games"),
            ],
            platform: "GOG".to_string(),
        },
        LauncherConfig {
            name: "Riot Games".to_string(),
            config_path: None,
            default_dirs: vec![
                PathBuf::from("C:/Riot Games"),
            ],
            platform: "Riot Games".to_string(),
        },
    ]
}

fn parse_libraryfolders_vdf(contents: &str) -> Vec<PathBuf> {
    let mut library_paths = Vec::new();
    let mut current_path: Option<String> = None;

    for line in contents.lines() {
        let line = line.trim();

        // Ищем ключ "path"
        if line.starts_with("\"path\"") {
            let parts: Vec<&str> = line.split('"').collect();
            if parts.len() >= 3 {
                current_path = Some(parts[3].to_string());
            }
        }

        // Если нашли путь, добавляем его
        if let Some(path) = current_path.take() {
            library_paths.push(PathBuf::from(path));
        }
    }

    library_paths
}


fn is_game_executable(path: &Path) -> bool {
    let filename = path.file_name().unwrap_or_default().to_string_lossy().to_lowercase();
    let parent_path = path.parent().unwrap_or_else(|| Path::new("")).to_string_lossy().to_lowercase();
    let normalized_parent_path = parent_path.replace("\\", "/");

    debug!("Проверка файла: {}", path.display());

    // Глобальные ключевые слова для исключения путей
    let excluded_keywords = vec![
        "steamworks",
        "_commonredist",
        "redist",
        "extras",
        "binaries",
        "bin",
        "__installer",
        "distribution",
        "unitycrashhandler",
    ];

    // Проверяем, содержит ли путь что-либо из excluded_keywords
    if excluded_keywords.iter().any(|keyword| normalized_parent_path.contains(keyword)) {
        info!(
            "Исключено по пути: {} (родительская директория содержит исключённое: {})",
            path.display(),
            normalized_parent_path
        );
        return false;
    }

    debug!(
        "Файл {} не исключён по пути (родительская директория: {}).",
        path.display(),
        normalized_parent_path
    );

    // Пример проверки по ключевым словам в имени файла
    let excluded_file_keywords = vec![
        "setup", "install", "uninstall", "crashhandler", "dxsetup", "vcredist",
        "launcher", "diagnostics", "unitycrashhandler", "steamredownloadfixer",
        "resourcecompiler", "webview", "render", "support", "cleanup", "touchup",
    ];
    if excluded_file_keywords.iter().any(|keyword| filename.contains(keyword)) {
        info!(
            "Исключено по ключевому слову: {} (файл содержит ключевое слово)",
            filename
        );
        return false;
    }

    debug!("Файл {} не исключён по ключевым словам.", filename);

    // Фильтр по размеру файла (например, меньше 10 МБ)
    if let Ok(metadata) = path.metadata() {
        if metadata.len() < 10_000_000 {
            info!(
                "Исключено по размеру: {} (размер: {} байт)",
                filename,
                metadata.len()
            );
            return false;
        }
    } else {
        warn!("Не удалось получить метаданные для файла: {}", path.display());
    }

    debug!(
        "Файл {} соответствует требованиям по размеру.",
        path.display()
    );

    // Проверка совпадения имени файла с именем директории
    if let Some(parent) = path.parent() {
        if let Some(parent_name) = parent.file_name() {
            if !filename.contains(&parent_name.to_string_lossy().to_lowercase()) {
                info!(
                    "Исключено: файл {} не соответствует названию директории {}",
                    filename,
                    parent_name.to_string_lossy()
                );
                return false;
            }
        }
    }

    debug!(
        "Файл {} соответствует требованиям по имени директории.",
        path.display()
    );

    info!("Файл подходит: {}", path.display());
    true
}

fn convert_to_readable_name(name: &str) -> String {
    let mut result = String::new();
    let mut prev_char_is_lower = false;

    for (i, c) in name.chars().enumerate() {
        if i > 0 && ((prev_char_is_lower && c.is_uppercase()) || c.is_digit(10)) {
            result.push(' ');
        }
        result.push(c);

        prev_char_is_lower = c.is_lowercase();
    }

    result
}

fn extract_game_name_from_directory(game_path: &str) -> Option<String> {
    let path = Path::new(game_path);

    // Получаем родительскую директорию
    if let Some(parent) = path.parent() {
        // Берем имя родительской директории
        if let Some(folder_name) = parent.file_name() {
            let original_name = folder_name.to_string_lossy().to_string();
            
            // Преобразуем имя папки
            let readable_name = convert_to_readable_name(&original_name).replace('_', " ");
            println!("Извлечено имя папки: {}", readable_name);

            return Some(readable_name);
        }
    }

    None
}

/// Преобразует имя в читаемый формат


fn get_steam_games(config_path: &PathBuf) -> Result<Vec<DetectedGame>, String> {
    debug!("Чтение файла конфигурации Steam: {}", config_path.display());
    
    let contents = fs::read_to_string(config_path)
        .map_err(|e| format!("Ошибка чтения файла Steam: {}", e))?;
    debug!("Успешно прочитан файл конфигурации Steam.");

    let library_paths = parse_libraryfolders_vdf(&contents);
    info!("Найденные библиотеки Steam: {:?}", library_paths);

    let mut games = Vec::new();

    // Указываем ключевые слова и правила исключения для Steam
    let excluded_keywords = vec![
        "setup", "install", "uninstall", "crashhandler", "dxsetup", "vcredist",
        "diagnostics", "unitycrashhandler", "steamredownloadfixer", "tools", "reporter",
        "resourcecompiler", "webview", "render", "support", "cleanup", "touchup", "diagnose",
        "profile", "client", "helper", "selector", "wallpaper32", "vr", "narakabladepoint", "32", "launcher"
    ];

    let excluded_paths = vec![
        "steamworks", "_commonredist", "redist", "extras", "binaries", "bin", "__installer", "distribution", "SitreamingAssets", "_data",
    ];

    for library_path in library_paths {
        let games_dir = library_path.join("steamapps/common");
        debug!("Проверяем наличие директории: {}", games_dir.display());

        if games_dir.exists() {
            info!("Сканирование библиотеки Steam: {}", games_dir.display());

            for entry in WalkDir::new(games_dir).max_depth(2).into_iter().filter_map(Result::ok) {
                let file_path = entry.path();

                debug!("Обнаружен файл: {}", file_path.display());

                // Проверяем, является ли файл исполняемым
                if file_path.is_file()
                    && file_path.extension().map(|ext| ext == "exe").unwrap_or(false)
                    && is_game_executable_for_steam(file_path, &excluded_keywords, &excluded_paths)
                {
                     let game_name = extract_game_name_from_directory(file_path.to_str().unwrap_or("Unknown"))
                            .unwrap_or("Unknown".to_string());
                    info!("Файл подходит: {}", file_path.display());
                        games.push(DetectedGame {
                            name: game_name,
                            description: None,
                            path: Some(file_path.to_string_lossy().to_string()),
                            platform: "Steam".to_string(),
                            url: None,
                            cover: None,
                            genres: None,         // Изначально пустые
                            developers: None,     // Изначально пустые
                            platforms: None,      // Изначально пустые
                        });

                } else {
                    debug!(
                        "Файл отклонён: {} (либо не исполняемый, либо расширение не .exe, либо исключён)",
                        file_path.display()
                    );
                }
            }
        } else {
            warn!("Библиотека Steam не найдена: {}", games_dir.display());
        }
    }

    info!("Всего обнаружено игр: {}", games.len());
    Ok(games)
}

// Дополнительная функция для проверки исполняемого файла Steam
fn is_game_executable_for_steam(path: &Path, excluded_keywords: &[&str], excluded_paths: &[&str]) -> bool {
    let filename = path.file_name().unwrap_or_default().to_string_lossy().to_lowercase();
    let parent_path = path.parent().unwrap_or_else(|| Path::new("")).to_string_lossy().to_lowercase();

    // Исключение по ключевым словам в названии
    if excluded_keywords.iter().any(|keyword| filename.contains(keyword)) {
        info!(
            "Исключено по ключевому слову: {} (файл содержит ключевое слово)",
            filename
        );
        return false;
    }

    // Исключение по пути
    if excluded_paths.iter().any(|dir| parent_path.contains(dir)) {
        info!("Исключено по пути: {} (директория содержит исключённое)", parent_path);
        return false;
    }

    true
}



fn get_riot_games_launcher() -> Option<DetectedGame> {
    let riot_launcher_path = PathBuf::from("C:/Riot Games/Riot Client/RiotClientServices.exe");

    if riot_launcher_path.exists() {
        println!("Найден Riot Games Launcher: {}", riot_launcher_path.display());

        return Some(DetectedGame {
            name: "Riot Games Launcher".to_string(),
            description: Some("Riot Games Launcher для запуска игр от Riot Games.".to_string()),
            path: Some(riot_launcher_path.to_string_lossy().to_string()),
            platform: "Riot Games".to_string(),
            url: None,  // Можно указать официальный сайт Riot Games, если нужно
            cover: None,
            genres: None,
            developers: Some(vec!["Riot Games".to_string()]),
            platforms: Some(vec!["Windows".to_string()]),
        });
    }

    println!("Riot Games Launcher не найден.");
    None
}

pub fn scan_for_games() -> Result<Vec<DetectedGame>, String> {
    let mut games = Vec::new();

    for launcher in get_launchers() {
        // Сканирование конфигурационного файла
        if let Some(config_path) = &launcher.config_path {
            if config_path.exists() {
                println!("Чтение конфигурации: {}", config_path.display());
                match get_steam_games(config_path) {
                    Ok(steam_games) => {
                        println!(
                            "Найдено {} игр в конфигурации {}.",
                            steam_games.len(),
                            launcher.name
                        );
                        games.extend(steam_games);
                    }
                    Err(err) => {
                        eprintln!(
                            "Ошибка чтения конфигурации {}: {}",
                            launcher.name, err
                        );
                    }
                }
            } else {
                eprintln!("Файл конфигурации {} не найден: {}", launcher.name, config_path.display());
            }
        }

        // Сканирование директорий
        for dir in &launcher.default_dirs {
            if dir.exists() {
                println!("Сканирование директории: {}", dir.display());

                // Добавляем только Riot Games лаунчер
                if launcher.name == "Riot Games" {
                    if let Some(riot_launcher) = get_riot_games_launcher() {
                        games.push(riot_launcher);
                    }
                    continue; // Пропускаем остальные игры для Riot Games
                }

                for entry in WalkDir::new(dir).into_iter().filter_map(Result::ok) {
                    let file_path = entry.path();

                    if file_path.is_file()
                        && file_path.extension().map(|ext| ext == "exe").unwrap_or(false)
                        && is_game_executable(file_path)
                    {
                        let game_name = extract_game_name_from_directory(file_path.to_str().unwrap_or("Unknown"))
                            .unwrap_or("Unknown".to_string());
                        
                        println!("Добавлена игра: {} ({})", game_name, file_path.display());

                        games.push(DetectedGame {
                            name: game_name,
                            description: None,
                            path: Some(file_path.to_string_lossy().to_string()),
                            platform: launcher.platform.clone(),
                            url: None,
                            cover: None,
                            genres: None,
                            developers: None,
                            platforms: None,
                        });
                    }
                }
            } else {
                eprintln!("Директория {} не найдена.", dir.display());
            }
        }
    }

    println!("Всего найдено игр: {}", games.len());
    Ok(games)
}
