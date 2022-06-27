use super::{db, text};

use axum::{
    response::Html,
    extract::Multipart
};
use askama::Template;

// HTML template
#[derive(Template)]
#[template(path = "table.html")]

struct LogTemplate<'a> {
    file: &'a str
}

pub async fn table(mut multipart: Multipart) -> Html<&'static str> {
    // create variable to smuggle value out of while loop
    // MUST be a String, not a str or &str
    // CANNOT be a borrowed or else it will go out of scope
    let mut name: String = String::new();

    while let Some(file) = multipart.next_field().await.unwrap() {
        let content_type = file.content_type().unwrap().to_string();
        let file_name = file.file_name().unwrap().to_string();

        // saving private ryan
        name = file.file_name().unwrap().to_string();

        println!("\x1b[1m\x1b[35m[lumberjack] \x1b[33m\x1b[1m{} \x1b[34m\x1b[1m({}) \x1b[32muploaded successfully\x1b[m", file_name, content_type);

        if content_type == "text/plain" {
            let text = file.text().await.unwrap();
            text::parse(text);
        } else {
            let data = file.bytes().await.unwrap();
            let rows = db::parse(data);

            // send back file upload page if file is an invalid format
            if rows == Vec::new() {
                return Html(include_str!("../templates/index.html"));
            }
        }
    }

    let html = LogTemplate { file: &name };
    // converts String to &'static str
    ////// - converts the String instance into a boxed str and immediately leaks it
    ////// - frees all excess capacity the string may currently occupy
    let html = Box::leak(html.render().unwrap().into_boxed_str());
    Html(html)
}
