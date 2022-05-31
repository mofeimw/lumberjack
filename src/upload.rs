use super::parse::parse;

use axum::response::Html;

pub async fn upload(body: String) -> Html<&'static str> {
    parse(body);

    Html(include_str!("../log.html"))
}
