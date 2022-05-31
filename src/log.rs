use super::{db, text};

use axum::{
    response::Html,
    extract::Multipart
};

pub async fn upload(mut multipart: Multipart) -> Html<&'static str> {
    while let Some(file) = multipart.next_field().await.unwrap() {
        let content_type = file.content_type().unwrap().to_string();
        let name = file.file_name().unwrap().to_string();

        if (content_type != "text/plain") && (content_type != "application/octet-stream") {
        println!("\x1b[1m\x1b[35m[lumberjack] \x1b[33m\x1b[1m{} \x1b[34m\x1b[1m({}) \x1b[31mis an invalid log file\x1b[m", name, content_type);
            return Html(include_str!("../index.html"));
        }

        println!("\x1b[1m\x1b[35m[lumberjack] \x1b[33m\x1b[1m{} \x1b[34m\x1b[1m({}) \x1b[32muploaded successfully\x1b[m", name, content_type);

        if content_type == "text/plain" {
            let text = file.text().await.unwrap();
            text::parse(text);
        } else if content_type == "application/octet-stream" {
            let data = file.bytes().await.unwrap();
            let rows = db::parse(data);

            if rows == Vec::new() {
                return Html(include_str!("../index.html"));
            }

            for row in rows {
                println!("{:?}", row);
            }
        }
    }

    Html(include_str!("../log.html"))
}
