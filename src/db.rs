use bytes::Bytes;
use rusqlite::Connection;
use std::{
    fs::File,
    io::Write
};

#[derive(Debug, PartialEq)]
pub struct Row {
    pub title: String,
    pub mime: String,
    pub modified: i64,
    pub viewed: i64
}

pub fn parse(data: Bytes) -> Vec<Row> {
    let mut file = File::create("file").unwrap();
    file.write_all(&data).unwrap();

    let db = Connection::open("file").unwrap();

    let state = db.prepare("SELECT local_title, mime_type, viewed_by_me_date, modified_date FROM items;");

    // query the database
    match state {
        Ok(mut state) => {
            let query = state.query_map([], |row| {
                // fill our Row struct with the data
                Ok(Row {
                    title: row.get(0).unwrap(),
                    mime: row.get(1).unwrap(),
                    viewed: row.get(2).unwrap(),
                    modified: row.get(3).unwrap()
                })
            }).unwrap();

            // fill up a Vector and return it
            let mut rows: Vec<Row> = Vec::new();
            for row in query {
                rows.push(row.unwrap());
            }

            return rows;
        },
        Err(_) => {
            // invalid database file - return empty Vector
            println!("\x1b[1m\x1b[35m[lumberjack] \x1b[31minvalid database file\x1b[m");
            return Vec::new();
        }
    }
}
