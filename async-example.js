const HealthLytix = require('hytx-sdk-js');
const hytx = new HealthLytix('ApiID', 'ApiSecret');

(async function() {
    try {
        const hello = await hytx.ping();

        // upload a file
        // inputFile is the location of the file to upload
        // inputContent is the content-type of the file
        const inputFile = "./my-file";
        const inputContent = "text/plain";
        let requestId = await hytx.uploadFile(inputFile, inputContent);

        // run one of our apps... Alzheimers PHS
        // report will have the results
        const subjectAge = 70;
        const report = await hytx.runAlzheimersPHS(requestId, subjectAge)

        // check if report returned
        // check out https://developer.healthlytix.com/#alzheimers-phs
        // for details on the report Object structure
        if (report.requestId)
            console.log("Yay! ran the Alzheimer's App!");


        // retrieve some old results...sometime later
        const oldReport = await hytx.getAlzheimersPHS(requestId);
        if (oldReport.requestId)
            console.log("Ohh yeah! got the Alzhiemer's results report!");

        // lets upload the file again and run the
        // prostate PHS app
        requestId = await hytx.uploadFile(inputFile, inputContent);
        const prostateReport = await hytx.runProstatePHS(requestId, subjectAge)
        if(prostateReport.requestId)
            console.log("Yay! ran the Prostate's App!");

        // retrieve some old results...sometime later
        const oldProstateReport = await hytx.getProstatePHS(requestId);
        if (oldProstateReport.requestId)
            console.log("Ohh yeah! got the Prostate report!");

    } catch (e) {
        console.error(e);
    }
})();