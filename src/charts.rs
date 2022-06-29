use axum::{
    response::Html,
    extract::Form
};
use askama::Template;
use serde::Deserialize;

// HTML template
#[derive(Template)]
#[template(path = "charts.html")]
struct ChartsTemplate {
    file_name: String
}

// receive form data from /table
#[derive(Deserialize)]
#[allow(dead_code)]
pub struct TableForm {
    file_name: String
}

pub async fn charts(form: Form<TableForm>) -> Html<&'static str> {
    let table_form: TableForm = form.0;

    let html = ChartsTemplate { file_name: table_form.file_name };
    let html = Box::leak(html.render().unwrap().into_boxed_str());
    Html(html)
}
