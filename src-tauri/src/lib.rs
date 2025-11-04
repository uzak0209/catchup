use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    data: String,
}

/// Zenn APIからデータを取得
#[tauri::command]
async fn fetch_zenn_articles() -> Result<String, String> {
    let url = "https://zenn.dev/api/articles?order=liked";

    let response = reqwest::get(url)
        .await
        .map_err(|e| format!("Failed to fetch Zenn articles: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    Ok(response)
}

/// GitHub Trending APIからデータを取得
#[tauri::command]
async fn fetch_github_trending() -> Result<String, String> {
    // 直近7日間で作成されたリポジトリをスター数順で取得
    let seven_days_ago = chrono::Utc::now() - chrono::Duration::days(7);
    let date_str = seven_days_ago.format("%Y-%m-%d").to_string();
    let url = format!(
        "https://api.github.com/search/repositories?q=created:>{}&sort=stars&order=desc&per_page=30",
        date_str
    );

    let client = reqwest::Client::builder()
        .user_agent("CatchUp/1.0")
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {}", e))?;

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch GitHub trending: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    Ok(response)
}

/// Reddit APIからデータを取得
#[tauri::command]
async fn fetch_reddit_posts(subreddit: String) -> Result<String, String> {
    let url = format!("https://www.reddit.com/r/{}/hot.json?limit=10", subreddit);

    let client = reqwest::Client::builder()
        .user_agent("CatchUp/1.0")
        .build()
        .map_err(|e| format!("Failed to build HTTP client: {}", e))?;

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch Reddit posts: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    Ok(response)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            fetch_zenn_articles,
            fetch_github_trending,
            fetch_reddit_posts
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
