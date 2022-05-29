use axum::{
    Router,
    routing::{get, get_service},
    response::Html,
    http::StatusCode
};
use tower_http::services::ServeDir;
use std::io;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(index))
        .fallback(get_service(ServeDir::new("."))
            .handle_error(|error: io::Error| async move {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("unhandled internal error: {}", error),
                )
            })
        );

    println!("server running on port 8888");
    axum::Server::bind(&"0.0.0.0:8888".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn index() -> Html<&'static str> {
    Html(include_str!("../index.html"))
}
