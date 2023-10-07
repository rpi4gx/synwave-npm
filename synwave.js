#!/usr/bin/env node

const { AxiosError } = require('axios');
const synwave = require('./main');

function usage() {
    console.log(`
    SynWave Command Line tool. https://synwave.io.

    Options:
        upload: Uploads a new file into SynWave service.
            Example: 
                synwave upload [file]

        list: Lists files stored on SynWave service.
            Example: 
                synwave list

        account_info: Shows a summary with account information
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
    let exitCode = 0
    const operation = process.argv[2]
    const debugging = process.argv.some(e => e == "--debug")
    switch (operation) {
        case "upload":
            {
                const file = process.argv[3]
                if (file) {
                    if (debugging) {
                        console.log(`Uploading file ${file} ....`)
                    }
                    let r = await synwave.uploadFile(file, {})
                    if (debugging) {
                        console.log('API response:')
                        console.log(JSON.stringify(r, null, 2))
                    }
                    if (r.success === true) {
                        console.log(`${r.file.address}`)
                    } else {
                        console.warn(`error: ${r.message}`)
                        exitCode = -1
                    }
                }
            }
            break;
        case "list":
            {
                let pageNumber = 0
                let pageSize = 50
                let r = await synwave.listStoredFiles(pageNumber, pageSize)
                if (debugging) {
                    console.log('API response:')
                    console.log(JSON.stringify(r, null, 2))
                }
                if (r.success === true) {
                    let files = r.response.files
                    console.table(files)
                } else {
                    console.warn(`error: ${r.message}`)
                    exitCode = -1
                }
            }
            break;
        case "delete":
            {
                let fileId = process.argv[3]
                let r = await synwave.deleteFile(fileId)
                if (debugging) {
                    console.log('API response:')
                    console.log(JSON.stringify(r, null, 2))
                }
                if (r.success === true) {
                    console.log(r.message)
                } else {
                    console.warn(`error: ${r.message}`)
                    exitCode = -1
                }
            }
            break;
        case "account_info":
            {
                let r = await synwave.getAccountInformation()
                if (debugging) {
                    console.log('API response:')
                    console.log(JSON.stringify(r, null, 2))
                }
                if (r.success === true) {
                    console.log(`Total number of files stored: ${r.info.files.total}`)
                    console.log(`Space usage:`)
                    console.table(r.info.usage)
                } else {
                    console.warn(`error: ${r.message}`)
                    exitCode = -1
                }
            }
            break;
        case "help":
            usage()
            break;
        default:
            usage()
            process.exit(-1)
    }
    process.exit(exitCode)
})()
