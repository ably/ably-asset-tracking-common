#!/usr/bin/env node
import * as Ably from 'ably/promises';
import { Command } from 'commander';
import { CHANNEL_PREFIX, CLIENT_ID } from './consts';
import { getEnhancedLocationsFromChannelHistory } from './getDataFromChannelHistory';
import { getDataFromFile } from './getDataFromFile';
import { saveDataToFile } from './saveDataToFile';
import { AblyCredentialsFileData, ConfigurationFileData, EnhancedLocationUpdate } from './types';
const onProcessInterrupted = require('death');
const VERSION = require('../package.json').version;

const program = new Command();

program.version(VERSION);

program.requiredOption('-c, --configuration <file>', 'configuration file');
program.option('-v, --verbose', 'enable verbose logging');

program.parse(process.argv);

const opts = program.opts();

const configurationData: ConfigurationFileData = getDataFromFile(opts.configuration);
if (
  !configurationData.sourceCredentials ||
  !configurationData.sourceTrackableId ||
  !configurationData.destinationFile
) {
  console.error('You need to specify source credentials, source trackable ID and destination file path.');
  process.exit(1);
}
if (
  configurationData.historyStartTime &&
  configurationData.historyFinishTime &&
  configurationData.historyStartTime > configurationData.historyFinishTime
) {
  console.error('History start time cannot be later than history finish time.');
  process.exit(1);
}
const sourceCredentialsData: AblyCredentialsFileData = getDataFromFile(configurationData.sourceCredentials);

if (opts.verbose) {
  console.log('Configuration file:', opts.configuration);
  console.log(configurationData);
  console.log('Source credentials file:', configurationData.sourceCredentials);
  console.log(sourceCredentialsData);
}
(async () => {
  let sourceAbly = new Ably.Realtime({ key: sourceCredentialsData.ablyApiKey, clientId: CLIENT_ID });

  let sourceChannel = sourceAbly.channels.get(`${CHANNEL_PREFIX}${configurationData.sourceTrackableId}`);
  if (opts.verbose) console.log('Source channel:', sourceChannel.name);

  const cleanupAbly = async () => {
    sourceAbly.close();
  };

  onProcessInterrupted(async (signal: any, error: any) => {
    console.log('Script interrupt detected. Beginning cleanup...');
    await cleanupAbly();
    console.log('Finished cleanup');
    process.exit(1);
  });

  if (opts.verbose) console.log('Downloading location data from Ably channel history...');
  const locationUpdates: EnhancedLocationUpdate[] = await getEnhancedLocationsFromChannelHistory(
    sourceChannel,
    configurationData.historyStartTime,
    configurationData.historyFinishTime
  );
  if (opts.verbose) {
    console.log('Location data downloaded');
  }

  if (opts.verbose) console.log(`Saving location messages...`);
  saveDataToFile(configurationData.destinationFile, locationUpdates);
  if (opts.verbose) console.log(`Finished saving location messages`);

  await cleanupAbly();

  process.exit(0);
})();
