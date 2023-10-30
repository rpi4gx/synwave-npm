var axios = require('axios');
const fs = require('fs')
const FormData = require('form-data');
const store = require('./store');

const baseUrl = "https://synwave.io"

var defaultOptions = {
    method: '',
    url: '',
    headers: {},
    params: {}
}


function getAxiosOptions(method, url, cid) {
    let options = defaultOptions
    options.method = method
    options.url = url
    if (cid !== undefined && cid !== null) {
        options.headers['x-synwave-cid'] = cid
    }
    return options
}

function extractIdHeader(response) {
    if ('x-synwave-cid' in response.headers) {
        let cid =  response.headers['x-synwave-cid']
        if (cid !== undefined && cid.length > 0) {
            return cid
        }
    }
    return null
}

function uploadFile(fileLocation, synwaveParameters) {
    return new Promise((resolve, reject) => {
        try {
            let cid = store.getUserId()
            const fileStream = fs.createReadStream(fileLocation)
            const formd = new FormData()
            formd.append('file', fileStream) 
            let options = getAxiosOptions('POST', `${baseUrl}/v1/upload`, cid)
            options.params = synwaveParameters
            options.data = formd
            options.headers = {
                ...options.headers,
                ...formd.getHeaders()
            }
            axios.request(options).then(function (response) {
                let cid = extractIdHeader(response)
                store.storeUserId(cid)
            	resolve(response.data);
            }).catch(function (error) {
                if (error.response !== undefined && error.response.data !== undefined) {
                    resolve(error.response.data);
                } else {
                    reject(error)
                }    
            });
        } catch(e) {
            reject(e)
        }
    })
}

function listStoredFiles(pageNumber, pageSize) {
    return new Promise((resolve, reject) => {
        try {
            let cid = store.getUserId()
            let query = ""
            if (pageNumber !== undefined) {
                query = `page_number=${pageNumber}`
            }
            if (pageSize !== undefined) {
                query += `&page_size=${pageSize}`
            }
            let options = getAxiosOptions('GET', `${baseUrl}/v1/files?${query}`, cid)
            axios.request(options).then(function (response) {
                let cid = extractIdHeader(response)
                store.storeUserId(cid)
            	resolve(response.data);
            }).catch(function (error) {
                if (error.response !== undefined && error.response.data !== undefined) {
                    resolve(error.response.data);
                } else {
                    reject(error)
                }    
            });
        } catch(e) {
            reject(e)
        }
    })
}

function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
        try {
            let cid = store.getUserId()
            let options = getAxiosOptions('DELETE', `${baseUrl}/v1/delete/${fileId}`, cid)
            axios.request(options).then(function (response) {
            	resolve(response.data);
            }).catch(function (error) {
                if (error.response !== undefined && error.response.data !== undefined) {
                    resolve(error.response.data);
                } else {
                    reject(error)
                }            	
            });
        } catch(e) {
            reject(e)
        }
    })
}

function getAccountInformation() {
    return new Promise((resolve, reject) => {
        try {
            let cid = store.getUserId()
            let options = getAxiosOptions('GET', `${baseUrl}/v1/account_info`, cid)
            axios.request(options).then(function (response) {
                let cid = extractIdHeader(response)
                store.storeUserId(cid)
            	resolve(response.data);
            }).catch(function (error) {
                if (error.response !== undefined && error.response.data !== undefined) {
                    resolve(error.response.data);
                } else {
                    reject(error)
                }    
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
