## Asset Tracking Location Replaying

This project contains a simple script that retrieves locations from Ably channel history (or S3 - TBD) and publishes them in a channel. From subscribers point of view it works exactly like a publisher SDK.

### Installation

First, to install npm dependencies run `npm install` in this directory.
Then, to build the script run `npm run build` in this directory.

Then you will need to create a script configuration file and a credentials configuration file.

For convenience you may also add it to your global path by running `npm i -g .` in the root directory of this project. Once you have done this the CLI will be added to your path as `asset-tracking-location-replaying`. Example usage: `asset-tracking-debugger -v --configuration my_configuration.json`.

#### Configuration file format

File format: JSON

```javascript
{
  "source": "Ably", // Select the data source Ably History (or AWS S3 - TBD)
  "sourceCredentials": "path_to_file.json", //  Path to a Ably (or AWS - TBD) credentials file for accessing the data source
  "sourceTrackableId": "FIRST_ID", // Trackable ID to replay
  "destinationCredentials": "another_path_to_file.json", //  Path to a file with Ably destination credentials (optional)
  "destinationTrackableId": "SECOND_ID", //  Destination Trackable ID  (optional)
  "adjustTimestamps": true, // Amend timestamps of saved data to current time (optional)
  "loop": true, // Replay the trip data in a loop (optional)
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

You can run the asset-tracking-location-replaying using `npm start --` with mandatory configuration file and other optional script arguments provided after `--`.
Example usage: `npm start -- --configuration my_configuration.json`.

You can also separately build the script with `npm run build` and then use node with the `./lib/index.js` file to run it.
Example usage `npm run build && node ./lib/index.js --configuration my_configuration.json`

Use the `--help` flag to see a list of available options.
