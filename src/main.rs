mod upload;
mod index;
mod db;
mod text;

use self::upload::upload;
use self::index::index;

use axum::{
    Router,
    routing::{get, get_service, post},
    http::StatusCode
};
use tower_http::services::ServeDir;
use std::io;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(index))
        .route("/lumber", post(upload))
        .fallback(get_service(ServeDir::new("."))
            .handle_error(|error: io::Error| async move {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("unhandled internal error: {}", error),
                )
            })
        );

    println!("\x1b[35m\x1b[1m[lumberjack]\x1b[m server running on port 8888");
    axum::Server::bind(&"0.0.0.0:8888".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
