use bytes::Bytes;
use rusqlite::Connection;
use std::fs::File;
use std::io::Write;

#[derive(Debug)]
pub struct Item {
    pub title: String,
    pub mime: String,
    pub modified: i64,
    pub viewed: i64
}

pub fn parse(data: Bytes) {
    let mut file = File::create("file").unwrap();
    file.write_all(&data).unwrap();

    let db = Connection::open("file").unwrap();

    let mut state = db.prepare("SELECT local_title, mime_type, viewed_by_me_date, modified_date FROM items;").unwrap();

    let items = state.query_map([], |row| {
        Ok(Item {
            title: row.get(0).unwrap(),
            mime: row.get(1).unwrap(),
            viewed: row.get(2).unwrap(),
            modified: row.get(3).unwrap()
        })
    }).unwrap();

    for item in items {
        println!("{:?}", item.unwrap());
    }
}
