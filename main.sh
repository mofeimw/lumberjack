#!/bin/bash
# 
# parses google drive log into .json file, and then serves to static webpage

main() {
    json="["
    [ ! -f drive_fs.txt ] && {
        echo "make sure the log file [drive_fs.txt] is in the current directory"
        exit 1
    }

    while read -r line; do
        parse "$line"
    done < drive_fs.txt

    json="${json%???}\n]"
    js="const log = ${json}"

    printf "$json" > log.json
    printf "$js" > js/log.js

    open index.html
}

parse() {
    line="$1"
    regex="^([0-9\-]+)T([0-9:\.]+).+Replay(Create|Delete|Rename|MetadataChange).+Drive[\/](.+)$"
    if [[ "$line" =~ $regex ]]; then
        date="${BASH_REMATCH[1]}"
        time="${BASH_REMATCH[2]}"
        action="${BASH_REMATCH[3]}"
        action="${action//Metadata}"
        file="${BASH_REMATCH[4]}"

        json+="
    {
        \"action\": \"${action}\",
        \"file\": \"${file}\",
        \"date\": \"${date}\",
        \"time\": \"${time}\"
    },\n"
    fi
}

main "$@"
