const rp = require('request-promise');
const request = require('request')
const fs = require('fs');

const endpoints = {
    "ping": "/id/ping",
    "getUploadUrl": "/data/getUploadUrl",
    "runAlzheimersPHS": "/app-alzgenic/run-app",
    "getAlzheimersPHS": "/app-alzgenic/results?requestId="
}

class HealthLytix {
    /**
     * Healthlytix SDK
     * Enables fast and easy access to the Healthlytix APIs on the 
     * HealthlytixCloud Platform
     * @param {String} apiId API ID for authorization
     * @param {String} apiSecret API Secret for authorization
     * @param {boolean} debug Enables console debugging outputs
     */
    constructor(apiId, apiSecret, debug, publicApiURL) {
        if (!apiId || !apiSecret)
            throw 'Failed to initialize the HealthLytix Class. Please provide a valid apiId and apiSecret when initializing.';
        this.apiId = apiId;
        this.apiSecret = apiSecret;
        this.publicApiURL = publicApiURL || 'https://api.healthlytix.io';
        this.logger = new logger(debug);
        this.token = `apiId ${this.apiId} apiSecret ${this.apiSecret}`;
    }

    /**
     * Process PHS Algorithm on the Healthlytix Platform
     * 
     * @param {String} requestId The requestId returned from uploading the 23andme, Ancestry or VCF file with genetic info to 
     * the healthlytix platform. You can get this value from running uploadFile()
     * @param {Number} age Age of subject
     * @param {Function} callback Callback function that returns (err, report). Refer to API docs for report object structure.
     * 
     * @returns {Promise} Returns a promise if no callback specified
     */
    runAlzheimersPHS(requestId, age, callback) {

        if (callback === undefined) {
            return new Promise((resolve, reject) => {
                this.runAlzheimersPHS(requestId, age, (err, report) => err ? reject(err) : resolve(report))
            });
        }

        let options = {
            method: 'POST',
            uri: `${this.publicApiURL}${endpoints["runAlzheimersPHS"]}`,
            headers: {
                Authorization: this.token, 
                'content-type': 'application/json'
            },
            body: {
                requestId: requestId,
                age: age
            },
            json: true
        }

        rp(options)
        .then((response) => {
            this.logger.info("AlzGenic Processing Completed")
            callback(null, response);
        })
        .catch((err) => {
            this.logger.error(err);
            callback(err);
        });
    }

    /**
     * Retrieve previously processed results from the Alzheimers's PHS app
     * @param {string} requestId Original requestId used when processing the original genetic data to retrieve
     * @param {Function} callback (err, report), where report is the previously calculated results
     * @returns {Promise} Returns a promise if no callback provided
     */
    getAlzheimersPHS(requestId, callback)
    {
        if (callback === undefined) {
            return new Promise((resolve, reject) => {
                this.getAlzheimersPHS(requestId, (err, report) => err ? reject(err) : resolve(report))
            });
        }

        let options = {
            method: 'GET',
            uri: `${this.publicApiURL}${endpoints["getAlzheimersPHS"]}${requestId}`,
            headers: {
                Authorization: this.token
            }
        }

        request(options, (err, response, body) => {
            if (err || !body) {
                this.logger.error(err);
                callback(err);
            } else {
                // successfull! callback!
                body = JSON.parse(body)
                this.logger.info(body)
                callback(null, body)
            }
        });
    }

    /**
     * Uploads a file securely to the Healthlytix Platform
     * callback returns an error (if any) and the requestId 
     * which is required for other API requests that need 
     * to use the uploaded file
     * 
     * @param {String} file Path to file to upload 
     * @param {String} contentType The content-type of the file, eg. text/plain, application/json, etc...
     * @param {Function} callback Callback function which returns (err, requestId)
     * 
     * @returns {Promise} Returns a promise with the requestId if no callback specified
     */
    uploadFile(file, contentType, callback) {

        // check contentType. If function, reassign to callback
        if (contentType instanceof Function) {
            callback = contentType;
            contentType = null;
        }

        if (callback === undefined) {
            return new Promise((resolve, reject) => {
                this.uploadFile(file, contentType, (err, requestId) => err ? reject(err) : resolve(requestId))
            });
        }

        // default contentType to 'text/plain' if null
        contentType = contentType || "text/plain";

        // build the request for retrieving the pre-signed URL for file upload
        let options = {
            method: 'POST',
            uri: `${this.publicApiURL}${endpoints["getUploadUrl"]}`,
            body: { type: contentType },
            json: true,
            headers: {
                Authorization: `apiId ${this.apiId} apiSecret ${this.apiSecret}`
            }
        };

        // POST request to api/getUploadURL
        rp(options)
            .then((urlBody) => {
                // check response for valid pre-signed URL and
                // requestId
                // NOTE: requestId is required for other requests
                if (urlBody.uploadURL && urlBody.requestId) {
                    this.logger.info(`Got Pre-signed URL with ID: ${urlBody.requestId}`)
                    // read the file
                    fs.readFile(file, (err, data) => {
                        if (err || !data) {
                            this.logger.error(err);
                            callback(err);
                        } else {
                            // prepare PUT request for upload file
                            options.method = 'PUT';
                            options.uri = urlBody.uploadURL;
                            options.headers = {};
                            options.headers['content-type'] = 'text/plain';
                            options.body = data;
                            options.json = false;

                            // PUT request to urlBody.uploadURL 
                            // this actually uploads the file
                            request(options, (err, response, body) => {
                                if (err) {
                                    this.logger.error('Upload failed:', err);
                                    callback(err);
                                } else {
                                    // successfull! callback!
                                    this.logger.info('Upload successful!');
                                    callback(null, urlBody.requestId)
                                }
                            });
                        }
                    })
                } else {
                    err = 'Failed to retrieve a valid "uploadURL" and "requestId"';
                    this.logger.error(err);
                    callback(err);
                }
            })
            .catch((err) => {
                this.logger.error(err);
                callback(err);
            });
    }

    ping(callback) {

        if (callback === undefined) {
            return new Promise((resolve, reject) => {
                this.ping((err, val) => err ? reject(err) : resolve(val))
            });
        }

        let options = {
            method: 'GET',
            uri: `${this.publicApiURL}${endpoints["ping"]}`,
            headers: {
                Authorization: `apiId ${this.apiId} apiSecret ${this.apiSecret}`
            }
        }

        request(options, (err, response, body) => {
            if (err || !body) {
                this.logger.error(err);
                callback(err);
            } else {
                // successfull! callback!
                body = JSON.parse(body)
                this.logger.info(body.message)
                callback(null, body.message)
            }
        });
    }


}

class logger {

    constructor(debug) {
        this.debugOn = debug;
    }

    info(log) {
        if (this.debugOn)
            console.info(`HYTX-SDK: Info: ${Date()}: ${log}`);
    }

    error(log) {
        if (this.debugOn)
            console.error(`HYTX-SDK: Error: ${Date()}: ${log}`);
    }
}

module.exports = HealthLytix;
