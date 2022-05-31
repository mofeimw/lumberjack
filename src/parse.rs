use bytes::Bytes;
use std::fs::File;
use std::io::Write;

pub fn plain(text: String) {
    println!("{}", text);
}

pub fn db(data: Bytes) {
    let mut file = File::create("file").unwrap();
    file.write_all(&data).unwrap();
}
