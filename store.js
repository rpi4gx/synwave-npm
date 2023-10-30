const homedir = require('os').homedir();
const fs = require('fs');
const path = require('node:path'); 

function getFileLocation() {
    return path.join(homedir, '.synwave')
}
function storeUserId(userId) {
    if (userId !== null) {
        let file = getFileLocation()
        try {
            fs.writeFileSync(file, userId);
        } catch(e) {
            console.warn(e)
        }
    }
}

function getUserId() {
    let file = path.join(homedir, '.synwave')
    try  {
        const userId = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
        return userId
    } catch(e) {
        return null
    }
}

exports.storeUserId = storeUserId;
exports.getUserId = getUserId;
