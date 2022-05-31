use super::parse;

use axum::{
    response::Html,
    extract::Multipart
};

pub async fn upload(mut multipart: Multipart) -> Html<&'static str> {
    while let Some(file) = multipart.next_field().await.unwrap() {
        let content_type = file.content_type().unwrap().to_string();
        let name = file.file_name().unwrap().to_string();

        println!("\x1b[35m\x1b[1m[lumberjack]\x1b[m \x1b[32m\x1b[1m{}\x1b[m \x1b[34m\x1b[1m({})\x1b[m uploaded successfully", name, content_type);

        if content_type == "text/plain" {
            let text = file.text().await.unwrap();
            parse::plain(text);
        } else {
            let data = file.bytes().await.unwrap();
            parse::db(data);
        }
    }

    Html(include_str!("../log.html"))
}
