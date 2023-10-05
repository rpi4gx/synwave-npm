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

function getAxiosOptions(method, url, key) {
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

function uploadFile(fileLocation, synwaveParameters) {
    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createReadStream(fileLocation)
            const formd = new FormData()
            formd.append('file', fileStream) 
            let options = getAxiosOptions('POST', `https://synwave.p.rapidapi.com/v1/upload`)
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

function listStoredFiles() {
    return new Promise((resolve, reject) => {
        try {
            let options = getAxiosOptions('GET', `https://synwave.p.rapidapi.com/v1/files`)
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

function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
        try {
            let options = getAxiosOptions('DELETE', `https://synwave.p.rapidapi.com/v1/delete/${fileId}`)
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

function getAccountInformation() {
    return new Promise((resolve, reject) => {
        try {
            let options = getAxiosOptions('GET', `https://synwave.p.rapidapi.com/v1/account_info`)
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
exports.listStoredFiles = listStoredFiles;
exports.deleteFile = deleteFile
exports.getAccountInformation = getAccountInformation
