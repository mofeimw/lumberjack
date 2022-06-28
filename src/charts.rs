use axum::response::Html;

pub async fn charts() -> Html<&'static str> {
    Html(include_str!("../templates/charts.html"))
}
