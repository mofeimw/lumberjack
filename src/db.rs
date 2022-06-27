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
                // fill a Row struct with the data
                Ok(Row {
                    title: row.get(0).unwrap(),
                    mime: row.get(1).unwrap(),
                    viewed: row.get(2).unwrap(),
                    modified: row.get(3).unwrap()
                })
            }).unwrap();

            // organize the data into a Vector
            let mut rows: Vec<Row> = Vec::new();
            for result in query {
                let row = result.unwrap();
                rows.push(row);
            }

            // serialize Vector into JSON
            // wrapped in a top level array
            let json = serde_json::to_string(&rows).unwrap();
            write("./lumber/data.json", json).unwrap();

            return rows;
        },
        Err(_) => {
            // invalid database file - return empty Vector
            println!("\x1b[1m\x1b[35m[lumberjack] \x1b[31minvalid database file\x1b[m");
            return Vec::new();
        }
    }
}
