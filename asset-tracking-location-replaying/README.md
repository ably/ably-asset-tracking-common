## Asset Tracking Location Replaying

This project contains a simple script that retrieves locations from Ably channel history (or S3 - TBD) and publishes them in a channel. From subscribers point of view it works exactly like a publisher SDK.

### Installation

First, to install npm dependencies run `npm install` in this directory.

Then you will need to create a script configuration file and a credentials configuration file.

#### Configuration file format

File format: JSON

```json
{
  "source": "Ably", // Select the data source Ably History (or AWS S3 - TBD)
  "sourceCredentials": "path_to_file.json", //  Path to a Ably (or AWS - TBD) credentials file for accessing the source file
  "sourceTrackableId": "FIRST_ID", // Trackable ID to replay
  "destinationCredentials": "another_path_to_file.json", //  Path to a file with Ably destination credentials (optional)
  "destinationTrackableId": "SECOND_ID", //  Destination Trackable ID  (optional argument)
  "adjustTimestamps": true, // Amend timestamps of saved data to current time (optional)
  "loop": true // Replay the trip data in a loop (optional)
}
```

#### Ably credentials file format

File format: JSON

```json
{
  "ablyApiKey": "<INSERT_ABLY_API_KEY>"
}
```

### Usage

You should run the asset-tracking-location-replaying using `npm start --` with mandatory configuration file and other optional script arguments provided after `--`.
Example usage: `npm start -- --configuration my_configuration.json`.

Use the `--help` flag to see a list of available options.
