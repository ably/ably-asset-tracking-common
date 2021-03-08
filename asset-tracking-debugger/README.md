## Asset Tracking Debugger

This project contains a simple script to publish mock publisher data for testing the asset-subscriber SDKs.

### Installation

First, to install npm dependencies run `npm install` in this directory.

Then you will need to add your Ably API key to the ABLY_API_KEY enviornment variable. The easiest way to do this is to add it to a .env file in the root directory of this project.

You can then run the asset-tracking-debugger using node, example usage: `node . --source my_journey.json`

For convenience you may also add it to your global path by running `npm i -g .` in the root directory of this project. Once you have done this the CLI will be added to your path as `asset-tracking-debugger`. Example usage: `asset-tracking-debugger --source my_journey.json`.

### Usage

Running without any arguments will use a default journey file (`src/defaultJourney.json`) and interactively prompt you to choose things like channel name, clientId, etc.

Use the `--help` flag to see a list of available options.
