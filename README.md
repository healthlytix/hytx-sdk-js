# HealthLytix SDK for NodeJS

[![NPM](https://nodei.co/npm/hytx-sdk-js.svg?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hytx-sdk-js/)

[![Version](https://badge.fury.io/js/hytx-sdk-js.svg)](http://badge.fury.io/js/hytx-sdk-js)

The official HealthLytix SDK for Node.js

## Installing

### In Node.js

The preferred way to install the HealthLytix SDK for Node.js is to use the
[npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:

```sh
npm install hytx-sdk-js
```

## Usage and Getting Started

You can find the RESTful API documenation here:

https://developer.healthlytix.com

More documenation for SDK coming soon...

### In Node.js

In a JavaScript file:

```javascript
// import entire SDK
const HealthLytix = require('hytx-sdk-js');
```

### Example

```javascript

// all methods return either a promise or callback if no promise provided
// it works with async/await
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
```

### Prostate Cancer PHS Example

To process a VCF/23andMe, or Ancestry.com genetic file with our Prostate Cancer PHS Algorithm, the workflow is the following:

1. If using VCF file, preprocess the file before uploading with the helper function `convertVCF(vcfFile, vcfOutputFile, qualityThresholdNumber)`
2. Upload the file
3. Invoke the processing using the `requestId` from step 2. You get immediately a response, but without the results. The results will be processed in 1 to 2 minutes. To get the results, proceed to step 4 after a minute or so.
4. Retrieve the results using the `getProstatePHS(requestId)` method and the requestId from step 2 and 3.

Here is an example with code when using VCF files:

```javascript
// path to my VCF file
const myVCFfile = 'path-to-my-vcf-file';

// where should we store the converted VCF file
const vcfOutput = 'file-to-write-new-VCF-file-to';

// convert it with our helper function
// only variants with PASS on the FILTER column will be kept
await hytx.convertVCF(myVCFfile, vcfOutput);

// (optional) to specify a threshold on the Qual field, use 
// convertVCFwithThreshold(vcfFile, vcfOutput, threshold, callback)
// instead of convertVCF()

// upload a file
const inputContent = "text/plain";
const requestId = await hytx.uploadFile(vcfOutput, inputContent);

// request the Prostate PHS Processing
const subjectAge = 70;
const response = await hytx.runProstatePHS(requestId, subjectAge);

// ...wait for about 2 minutes before proceeding

// get the results using the query method
// report will be an object with the API response.
// the structure of this object can be found on https://developer.healthlytix.com
// use the requestId from uploadFile()
const report = await hytx.getProstatePHS(requestId);
```

## API

This SDK has the following API methods:

* [convertVCF](#convertVCF)
* [convertVCFwithThreshold](#convertVCFwithThreshold)
* [uploadFile](#uploadFile)
* [ping](#ping)
* [runAlzheimersPHS](#runAlzheimersPHS)
* [getAlzheimersPHS](#getAlzheimersPHS)
* [runProstatePHS](#runProstatePHS)
* [getProstatePHS](#getProstatePHS)

### convertVCF

### convertVCFwithThreshold

### uploadFile

### ping

### runAlzheimersPHS

### getAlzheimersPHS

### runProstatePHS

### getProstatePHS

## Getting Help
Please use these community resources for getting help. We use the GitHub issues for tracking bugs and feature requests and have limited bandwidth to address them.

 * Ask a question on [StackOverflow](https://stackoverflow.com/) and tag it with `hytx-sdk-js`
 * If it turns out that you may have found a bug, please [open an issue](https://github.com/healthlytix/hytx-sdk-js/issues/new)

## Opening Issues
If you encounter a bug with the HealthLytix SDK for NodeJS we would like to hear
about it. Search the [existing issues](https://github.com/healthlytix/hytx-sdk-js/issues)
and try to make sure your problem doesn’t already exist before opening a new
issue. Please include a stack trace and reduced repro
case when appropriate, too.

The GitHub issues are intended for bug reports and feature requests. For help
and questions with using the HealthLytix SDK for NodeJS please make use of the
resources listed in the [Getting Help](https://github.com/healthlytix/hytx-sdk-js#getting-help)
section. There are limited resources available for handling issues and by
keeping the list of open issues lean we can respond in a timely manner.

## License

This SDK is distributed under the MIT License.

