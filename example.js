const HealthLytix = require('hytx-sdk-js');
const fs = require('fs');
const hytx = new HealthLytix('ApiID', 'ApiSecret');

// each method supports promises or callbacks
hytx.ping()
.then(msg => console.log(msg))
.catch(e => console.log(e));

hytx.ping((e, msg) => {
    // do something
})

// how to run the Alzheimers PHS app
const subjectAge = 70;
const inputFile = "your-genetics-file";
const inputContent = "text/plain";

// first upload the file and get a requestId
hytx.uploadFile(inputFile, inputContent)
.then(requestId => {
    // file uploaded!
    console.log(`File uploaded with requestId ${requestId}`); 
    // run the Alzheimers PHS algo on the HealthLytix cloud
    hytx.runAlzheimersPHS(requestId, subjectAge)
    .then(results => {
        // hooray! it worked
        // results has the report

        // this shows how to retrieve 
        // a previously calculated results.
        // use the same requestId
        hytx.getAlzheimersPHS(requestId)
        .then(report => console.log(report))
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
})
.catch(e => console.log(e));
