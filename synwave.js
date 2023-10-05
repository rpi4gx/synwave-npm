#!/usr/bin/env node

const synwave = require('./main');

function usage() {
    console.log(`
    SynWave Command Line tool. https://synwave.io.

    Options:
        upload: Upload a new file into SynWave service.
            Example: 
                synwave upload [file]

        list: List files stored on SynWave service.
            Example: 
                synwave list

        account_info: Show a summary with account information
            Example:
                synwave account

        delete: Delete a file store on SynWave service.
            Example: 
                synwave delete [file id]

        help: Shows this help

    Global flags:
        --debug: Shows API responses
    `)
}

(async () => {
    const operation = process.argv[2]
    switch (operation) {
        case "upload":
            {
                const file = process.argv[3]
                if (file) {
                    console.log(`uploading file ${file} ....`)
                    let r = await synwave.uploadFile(file, {})
                    console.log(r)
                    if (r && r.success === true) {
                        console.log(r.file.address)
                    }
                }
            }
            break;
        case "list":
            {
                let r = await synwave.listStoredFiles()
                console.log(JSON.stringify(r))
            }
            break;
        case "delete":
            {
                let fileId = process.argv[3]
                let r = await synwave.deleteFile(fileId)
                console.log(JSON.stringify(r))
            }
            break;
        case "account_info":
            {
                let r = await synwave.getAccountInformation()
                console.log(JSON.stringify(r))
            }
            break;
        case "help":
            usage()
            break;
        default:
            usage()
            process.exit(-1)
    }
})()
