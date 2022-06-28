mod index;
mod error;
mod table;
mod charts;
mod db;
mod text;

use self::{
    index::index,
    error::error,
    table::table,
    charts::charts
};

use axum::{
    Router,
    routing::{get, get_service, post},
    http::StatusCode
};
use tower_http::services::ServeDir;
use std::{io, env::var};

#[tokio::main]
async fn main() {
    // grab $PORT environment variable
    let port = match var("PORT") {
        Ok(n) => n,
        Err(_e) => 8888.to_string()
    };

    let app = Router::new()
        .route("/", get(index))
        .route("/error", get(error))
        .route("/table", post(table))
        .route("/charts", post(charts))
        .fallback(get_service(ServeDir::new("."))
            .handle_error(|error: io::Error| async move {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("unhandled internal error: {}", error),
                )
            })
        );

    println!("\x1b[1m\x1b[35m[lumberjack] \x1b[32mserver running on port {}\x1b[m", port);

    axum::Server::bind(&format!("0.0.0.0:{}", port).parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
