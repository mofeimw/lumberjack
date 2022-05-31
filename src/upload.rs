use axum::{
    response::Html,
    extract::{Multipart}
};

pub async fn upload(mut multipart: Multipart) -> Html<&'static str> {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        let file_name = field.file_name().unwrap().to_string();
        let content_type = field.content_type().unwrap().to_string();
        let data = field.bytes().await.unwrap();

        println!(
            "Length of {} ({}: {}) is {} bytes",
            name,
            file_name,
            content_type,
            data.len()
        );
    }

    Html(include_str!("../log.html"))
}
