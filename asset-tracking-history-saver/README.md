## Asset Tracking History Saver

This project contains a simple script that retrieves enhanced locations from an Ably channel history and saves them in a file.

### Installation

First, to install npm dependencies run `npm install` in this directory.
Then, to build the script run `npm run build` in this directory.

Then you will need to create a script configuration file and a credentials configuration file.

For convenience you may also add it to your global path by running `npm i -g .` in the root directory of this project. Once you have done this the CLI will be added to your path as `asset-tracking-history-saver`. Example usage: `asset-tracking-history-saver -v --configuration my_configuration.json`.

#### Configuration file format

File format: JSON

```javascript
{
  "sourceCredentials": "path_to_file.json", //  Path to an Ably credentials file for accessing the data source
  "sourceTrackableId": "TRACKABLE_ID", // Trackable ID to replay

  "destinationFile": "path_to_file.json", //  Path to a file that will be used to save the data

  "historyStartTime": 1623654722903, // Timestamp of the beginning of the replaying data (optional)
  "historyFinishTime": 1623654743184 // Timestamp of the end of the replaying data (optional)
}
```

#### Ably credentials file format

File format: JSON

```javascript
{
  "ablyApiKey": "<INSERT_ABLY_API_KEY>"
}
```

### Usage

You can run the asset-tracking-history-saver using `npm start --` with mandatory configuration file and other optional script arguments provided after `--`.
Example usage: `npm start -- --configuration my_configuration.json`.

You can also use node with the `./lib/index.js` file to run it.
Example usage `node ./lib/index.js --configuration my_configuration.json`

Use the `--help` flag to see a list of available options.
