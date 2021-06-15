#!/usr/bin/env node
import * as Ably from 'ably/promises';
import { Command } from 'commander';
import { CHANNEL_PREFIX, CLIENT_ID, ENHANCED_LOCATION_MESSAGE, PRESENCE_DATA_PUBLISHER_TYPE } from './consts';
import { getEnhancedLocationsFromChannelHistory } from './getDataFromChannelHistory';
import { getDataFromFile } from './getDataFromFile';
import { AblyCredentialsFileData, ConfigurationFileData, EnhancedLocationUpdate } from './types';
import { adjustLocationTimestamps, wait } from './utils';
const onProcessInterrupted = require('death');
const VERSION = require('../package.json').version;
const PRESENCE_DATA = JSON.stringify({ type: PRESENCE_DATA_PUBLISHER_TYPE });
const LOOP_RESTART_DELAY_IN_SECONDS = 1;

const program = new Command();

program.version(VERSION);

program.requiredOption('-c, --configuration <file>', 'configuration file');
program.option('-v, --verbose', 'enable verbose logging');

program.parse(process.argv);

const opts = program.opts();

const configurationData: ConfigurationFileData = getDataFromFile(opts.configuration);
if (!configurationData.source || !configurationData.sourceCredentials || !configurationData.sourceTrackableId) {
  console.error('You need to specify source, source credentials and source trackable ID.');
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
if (
  (configurationData.destinationCredentials && !configurationData.destinationTrackableId) ||
  (!configurationData.destinationCredentials && configurationData.destinationTrackableId)
) {
  console.error('You need to specify both destination credentials and destination trackable ID.');
  process.exit(1);
}
const isDestinationSpecified = configurationData.destinationCredentials && configurationData.destinationTrackableId;
const sourceCredentialsData: AblyCredentialsFileData = getDataFromFile(configurationData.sourceCredentials);
const destinationCredentialsData: AblyCredentialsFileData = isDestinationSpecified
  ? getDataFromFile(configurationData.destinationCredentials || '')
  : null;

if (opts.verbose) {
  console.log('Configuration file:', opts.configuration);
  console.log(configurationData);
  console.log('Source credentials file:', configurationData.sourceCredentials);
  console.log(sourceCredentialsData);
  console.log('Destination credentials file:', configurationData.destinationCredentials);
  console.log(destinationCredentialsData);
}
(async () => {
  let sourceAbly = new Ably.Realtime({ key: sourceCredentialsData.ablyApiKey, clientId: CLIENT_ID });
  let destinationAbly = isDestinationSpecified
    ? new Ably.Realtime({ key: sourceCredentialsData.ablyApiKey, clientId: CLIENT_ID })
    : sourceAbly;

  let sourceChannel = sourceAbly.channels.get(`${CHANNEL_PREFIX}${configurationData.sourceTrackableId}`);
  if (opts.verbose) console.log('Source channel:', sourceChannel.name);
  let destinationChannel = isDestinationSpecified
    ? destinationAbly.channels.get(`${CHANNEL_PREFIX}${configurationData.destinationTrackableId}`)
    : sourceChannel;
  if (opts.verbose) console.log('Destination channel:', destinationChannel.name);

  const cleanupAbly = async () => {
    if (opts.verbose) console.log('Leaving presence...');
    await destinationChannel.presence.leave(PRESENCE_DATA);
    if (opts.verbose) console.log('Presence left');

    sourceAbly.close();
    if (isDestinationSpecified) {
      destinationAbly.close();
    }
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
    console.log(locationUpdates);
  }

  if (opts.verbose) console.log('Entering presence...');
  await destinationChannel.presence.enter(PRESENCE_DATA);
  if (opts.verbose) console.log('Presence entered');

  if (opts.verbose) console.log(`Publishing location messages...`);
  for (let i = 0; i < locationUpdates.length; i++) {
    console.log(`Publishing location ${i}`);
    const locationUpdate = locationUpdates[i];
    let messageToSend = JSON.stringify(locationUpdate);
    if (configurationData.adjustTimestamps) {
      messageToSend = adjustLocationTimestamps(messageToSend);
    }
    if (opts.verbose) console.log('Sending: ', messageToSend);
    await destinationChannel.publish(ENHANCED_LOCATION_MESSAGE, messageToSend);
    const isLastMessage = i === locationUpdates.length - 1;
    if (!isLastMessage) {
      const nextLocationUpdate = locationUpdates[i + 1];
      const delayBetweenLocationUpdatesInSeconds =
        nextLocationUpdate.location.properties.time - locationUpdate.location.properties.time;
      if (opts.verbose) console.log('Delay:', delayBetweenLocationUpdatesInSeconds);
      await wait(delayBetweenLocationUpdatesInSeconds);
    } else if (isLastMessage && configurationData.loop) {
      if (opts.verbose) console.log('Looping events. Delay:', LOOP_RESTART_DELAY_IN_SECONDS);
      await wait(LOOP_RESTART_DELAY_IN_SECONDS);
      i = -1; // at the end of this block it will be incremented to 0 and restart the for loop
    }
  }
  if (opts.verbose) console.log(`Finished publishing location messages`);

  await cleanupAbly();

  process.exit(0);
})();
