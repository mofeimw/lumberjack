use bytes::Bytes;
use rusqlite::Connection;
use std::fs::{create_dir_all, write};
use serde::{Serialize, Deserialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Row {
    pub title: String,
    pub mime: String,
    pub modified: i64,
    pub viewed: i64
}

pub fn parse(data: Bytes) -> Vec<Row> {
    create_dir_all("./lumber").unwrap();
    write("./lumber/data", data).unwrap();

    let db = Connection::open("./lumber/data").unwrap();
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
            for result in query {
                let row = result.unwrap();
                rows.push(row);
            }

            to_json(&rows);
            return rows;
        },
        Err(_) => {
            // invalid database file - return empty Vector
            println!("\x1b[1m\x1b[35m[lumberjack] \x1b[31minvalid database file\x1b[m");
            return Vec::new();
        }
    }
}

pub fn to_json(rows: &Vec<Row>) {
    let json = serde_json::to_string(rows).unwrap();
    write("./lumber/data.json", json).unwrap();
}
