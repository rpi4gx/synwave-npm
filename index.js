var axios = require('axios');
const fs = require('fs')
const FormData = require('form-data');

const apiKeyName = "SYNWAVE_KEY"

var defaultOptions = {
    method: '',
    url: '',
    headers: {
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'synwave.p.rapidapi.com'
    },
    params: {}
}

const contentType = {
    BINARY: "binary",
    HTML: "html",
    JPEG: "jpeg",
    PNG: "png",
    MPEG: "mpeg",
    MP4: "mp4",
    MARKDOWN: "markdown",
    JSON: "json",
    TEXT: "text",
    PDF: "pdf",
    XML: "xml",
    JAVASCRIPT: "javascript"
}

function getOptions(method, url, key) {
    if (key === undefined && process.env[apiKeyName] && process.env[apiKeyName].length > 0) {
        key = process.env[apiKeyName]
    } else {
        throw new Error(`
            SynWave Client Library requires a valid Rapid API Key.
            Visit https://rapidapi.com/rpi4gx/api/synwave to get one for free.
        `)
    }
    let options = defaultOptions
    options.method = method
    options.url = url
    options.headers['X-RapidAPI-Key'] = key
    return options
}

function uploadFile(fileLocation, fileType, synwaveParameters) {
    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createReadStream(fileLocation)
            const formd = new FormData()
            formd.append('file', fileStream) 
            let options = getOptions('POST', `https://synwave.p.rapidapi.com/v1/upload/${fileType}`)
            options.params = synwaveParameters
            options.data = formd
            options.headers = {
                ...options.headers,
                ...formd.getHeaders()
            }
            axios.request(options).then(function (response) {
            	resolve(response.data);
            }).catch(function (error) {
            	reject(error);
            });
        } catch(e) {
            reject(e)
        }
    })
}


exports.uploadFile = uploadFile;
exports.contentType = contentType;
