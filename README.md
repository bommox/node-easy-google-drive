# Easy Google Drive

Easy NodeJS Google Drive API Auth in Promise way

## Why

Handling Google Drive API Authentication is not an easy task, with a lot of callbacks and token operations.

This scripts aims to ease this process.

## Usage

First of all, you need a `client_secrets.json`. Check Google doc for it: 
[https://developers.google.com/drive/v3/web/quickstart/nodejs] (Step 1)

Then, you can use this library in this way:

```js
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
```