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

You can find a getting started guide at:

https://developer.healthlytix.com

### In Node.js

In a JavaScript file:

```javascript
// import entire SDK
const HealthLytix = require('hytx-sdk-js');
```

### Example

```javascript
// all methods return either a promise or callback if async
// therefore we can use the new await to make the code cleaner

const HealthLytix = require('hytx-sdk-js');
const hytx = new HealthLytix('ApiID', 'ApiSecret');

(async function() {
    try {
        const hello = await hytx.ping();

        // upload a file
        // inputFile is the location of the file to upload
        // inputContent is the content-type of the file
        const inputFile = "your-file-path";
        const inputContent = "file-content-type";
        const requestId = await hytx.uploadFile(inputFile, inputContent);

        // run one of our apps... Alzheimers PHS
        // report will have the results
        const subjectAge = 70;
        const report = await hytx.runAlzheimersPHS(requestId, subjectAge)

        // check if report returned
        // check out https://developer.healthlytix.com/#alzheimers-phs
        // for details on the report Object structure
        if (report.requestId)
            console.log("Yay! ran the app!");

        const oldReport = await hytx.getAlzheimersPHS(requestId);
        if (oldReport.requestId)
            console.log("Ohh yeah! got that report!");

    } catch (e) {
        console.error(e);
    }
})();
```

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

