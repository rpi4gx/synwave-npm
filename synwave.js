#!/usr/bin/env node

const { AxiosError } = require('axios');
const synwave = require('./main');

function usage() {
    console.log(`
    SynWave Command Line tool. https://synwave.io.

    Actions:

        upload: Uploads a new file into SynWave service.

            $ synwave upload filename [--expiration value] [--download_limit value] [--auth_username username --auth_password password]
            
            Options:
                --expiration value: Number of seconds after the file will become unavailable.
                --download_limit value: Number of time the file can be downloaded until it becomes unavailable.
                --auth_username value: Username to protect this file. --auth_password is required if username is set.
                --auth_password value: Password to protect this file. --auth_username is required if password is set.

                Example: 
                    $ synwave upload myfile.txt --expiration 3600


        list: Lists files stored on SynWave service.

            $ synwave list


        account: Shows a summary with account information.

            $ synwave account
            

        delete: Delete a file store on SynWave service.
 
            $ synwave delete [file_id]


        help: Shows this help.

    Global flags:
        --debug: Shows API responses
    `)
}

async function main() {
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
        case "account":
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
}

(async () => {
    try {
        await main()
    } catch(e){
        console.warn(e.message)
        process.exit(-1)
    }
})()
