const EDrive = require('../index').EasyDrive
const fs = require('fs')
const Promise = require('bluebird').Promise
const readFile = Promise.promisify(require("fs").readFile);


function init() {
    readFile('client_secret.json')
        .then(raw => JSON.parse(raw))
        .then(secrets =>  EDrive.fromSecrets(secrets))
        .then(eDrive => createFile(eDrive))
        .then(_ => console.log("Done"))
        .catch(err => console.error(err))
}


/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {EasyDrive} auth An authorized OAuth2 client.
 */
function createFile(eDrive) {
    console.log("Create listFiles")
    var fileMetadata = {
      'name': 'config_' +  (+ new Date) +'.json',
      'parents': ['1JlP3wOUTWeA9lsVeloPdzGue8OnPkH-Y']
    };
    var media = {
      mimeType: 'application/json',
      body: '{"name":"Jorge"}'
    };
    eDrive.drive.files.create({
      auth: eDrive.auth,
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Folder Id:', file.id);
      }
    });
    return eDrive
  }

function listAppFolder(eDrive) {
  eDrive.drive.files.list({
    auth: eDrive.auth,
    spaces: 'appDataFolder',
    fields: 'nextPageToken, files(id, name)',
    pageSize: 100
  }, function (err, res) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log("Done")
      res.files.forEach(function (file) {
        console.log('Found file:', file.name, file.id);
      });
    }
  });
  return eDrive
}



init();

