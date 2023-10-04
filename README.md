## Javascript client library for [SynWave API](https://synwave.io/)

:warning: This library requires a valid Rapid API key to access SynWave API. A Rapid API key can easily be obtained on https://rapidapi.com/.

:information_source: More information about SynWave API can be found [here](https://rapidapi.com/rpi4gx/api/synwave).

### Example:

```
npm install -s synwave
```

Prepare a file to upload to Synwave API.
```
cat << EOF > sample.html
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
$ SYNWAVE_KEY=YOUR_API_KEY_HERE node main.js

Response API
{
  success: true,
  file: {
    id: 'KDhiyuEj2uLZtR2GjKe6zioMp_TXU69eBe1kiOxCsigPOTq-OUPL5uI1RKARdh8h',
    address: 'https://synwave.io/t/KDhiyuEj2uLZtR2GjKe6zioMp_TXU69eBe1kiOxCsigPOTq-OUPL5uI1RKARdh8h',
    size_bytes: 18,
    created_at: '2023-10-04T21:02:50.319Z',
    mimetype: 'text/html',
    filename: 'sample.html',
    expiration_time: '2023-10-04T22:02:50.000Z'
  }
}
File published at https://synwave.io/t/KDhiyuEj2uLZtR2GjKe6zioMp_TXU69eBe1kiOxCsigPOTq-OUPL5uI1RKARdh8h
```

### Library functions

* uploadFile(fileLocation, synwaveOptions) - Uploads a new file. 

    *fileLocation*: Path of local file to upload.

    *synwaveOptions*: An object with the following keys:

    * *download_limit*: Number of downloads before the file becomes unavailable.
    * *expiration_seconds*: Number of seconds before the file becomes unavailable.
    * *auth_username*: Username to protect this file. *auth_password* parameter is required if *auth_username* is set.
    * *auth_password* Password to protect this file. *auth_username* parameter is required if *auth_password* is set.
