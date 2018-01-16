const EDrive = require('./simple-google-drive').EasyDrive
const fs = require('fs')
const Promise = require('bluebird').Promise
const readFile = Promise.promisify(require("fs").readFile);


function init() {
    readFile('client_secret.json')
        .then(raw => JSON.parse(raw))
        .then(secrets =>  EDrive.fromSecrets(secrets))
        .then(eDrive => listFiles(eDrive))
        .then(_ => console.log("Done"))
        .catch(err => console.error(err))
}


/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {EasyDrive} auth An authorized OAuth2 client.
 */
function listFiles(eDrive) {
    console.log("Entering listFiles")
    eDrive.drive.files.list({
      auth: eDrive.auth,
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var files = response.files;
      if (files.length == 0) {
        console.log('No files found.');
      } else {
        console.log('Files:');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('%s (%s)', file.name, file.id);
        }
      }
    });
  }

init();