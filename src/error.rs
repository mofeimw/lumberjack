use axum::response::Html;

pub async fn error() -> Html<&'static str> {
    Html(include_str!("../templates/error.html"))
}
