const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.file'
];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-easy-2-drive.json';


class EasyDrive {

    constructor(auth) {
        this.drive =  google.drive('v3');
        this.auth = auth;
    }

    static fromSecrets(clientSecrets) {
        let clientSecret = clientSecrets.installed.client_secret;
        let clientId = clientSecrets.installed.client_id;
        let redirectUrl = clientSecrets.installed.redirect_uris[0];
        let auth = new googleAuth();
        let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      
        // Check if we have previously stored a token.
        return new Promise((resolve, reject) => {
    
            fs.readFile(TOKEN_PATH, function(err, token) {
                if (err) {
                    getNewToken(oauth2Client).then(auth => resolve(new EasyDrive(auth)))
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(new EasyDrive(oauth2Client));
                }
            });
        })
    }

}

function getNewToken(oauth2Client) {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    return new Promise((resolve, reject) => {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                reject(err)
            }
            oauth2Client.credentials = token;
            storeToken(token);
            resolve(oauth2Client);
            });
        });
    })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


exports.EasyDrive = EasyDrive