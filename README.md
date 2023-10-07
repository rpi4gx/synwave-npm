# NPM package for [SynWave API](https://synwave.io/)

:warning: A valid Rapid API key is required to access SynWave API. It can be easily obtained for free on https://rapidapi.com/.

:information_source: Full specification of SynWave API available [here](https://rapidapi.com/rpi4gx/api/synwave).

## Command line tool

### Installation
```
$ npm install -g synwave
```

### Set environment variable
```
$ export SYNWAVE_RAPIDAPI_KEY=__REPLACE_WITH_RAPIDAPI_KEY__
```

### Usage:
```
$ synwave help

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
    
```

## Library
### Installation:

```
$ npm install -s synwave
```

Prepare a file to upload to Synwave API.
```
$ cat << EOF > sample.html
<h1>hi there</h1>
EOF
```

Create `main.js` with the following content to upload `sample.html`:
```
const synwave = require('synwave');

// All are optional
const synwaveOptions = {
    download_limit: 15,
    expiration_seconds: 90,
    auth_username: 'my_username',
    auth_password: 'my_secret_password'
};

(async function main() {
    try {
        let r = await synwave.uploadFile('./sample.html', synwaveOptions)
        console.log('Response API')
        console.log(r)
        console.log(`File published at ${r.file.address}`)
    } catch (e) {
        console.warn(e)
    }
})()
```

The Rapid API key needs to be set by the SYNWAVE_KEY environment variable.

```
$ SYNWAVE_RAPIDAPI_KEY=__YOUR_RAPIDAPI_KEY_HERE__ node main.js

Response API
{
  success: true,
  file: {
    id: 'iL4w5pv46jnJEe5oAdl21Jqm59pEDR1JQ0XoqYQl3SO-P_ZXP8s0KU5EhZTPHAWb',
    address: 'https://synwave.io/t/iL4w5pv46jnJEe5oAdl21Jqm59pEDR1JQ0XoqYQl3SO-P_ZXP8s0KU5EhZTPHAWb',
    size_bytes: 18,
    created_at: '2023-10-07T16:03:48.351Z',
    mimetype: 'text/html',
    filename: 'sample.html',
    expiration_time: '2023-10-07T16:05:18.000Z',
    downloads_remaining: 15,
    authentication: { username: 'my_username', password: 'my_secret_password' }
  }
}
File published at https://synwave.io/t/iL4w5pv46jnJEe5oAdl21Jqm59pEDR1JQ0XoqYQl3SO-P_ZXP8s0KU5EhZTPHAWb
```

### Library functions

* uploadFile(fileLocation, synwaveOptions) - Uploads a new file. 

    *fileLocation*: Path of local file to upload.

    *synwaveOptions*: Optional. An object with the following keys:

    * *download_limit*: Number of downloads before the file becomes unavailable.
    * *expiration_seconds*: Number of seconds before the file becomes unavailable.
    * *auth_username*: Username to protect this file. *auth_password* parameter is required if *auth_username* is set.
    * *auth_password* Password to protect this file. *auth_username* parameter is required if *auth_password* is set.
