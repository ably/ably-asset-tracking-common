import * as Ably from 'ably/promises';
import { Command } from 'commander';
import { CHANNEL_PREFIX, CLIENT_ID, ENHANCED_LOCATION_MESSAGE, PRESENCE_DATA_PUBLISHER_TYPE } from './consts';
import { getEnhancedLocationsFromChannelHistory } from './getDataFromChannelHistory';
import { getDataFromFile } from './getDataFromFile';
import { AblyCredentialsFileData, ConfigurationFileData } from './types';
import { wait } from './utils';
const VERSION = require('../package.json').version;
const PRESENCE_DATA = JSON.stringify({ type: PRESENCE_DATA_PUBLISHER_TYPE });

const program = new Command();

program.version(VERSION);

program.requiredOption('-c, --configuration <file>', 'configuration file');
program.option('-v, --verbose', 'enable verbose logging');

program.parse(process.argv);

const opts = program.opts();

const configurationData: ConfigurationFileData = getDataFromFile(opts.configuration);
const credentialsData: AblyCredentialsFileData = getDataFromFile(configurationData.sourceCredentials);

if (opts.verbose) {
  console.log('Configuration file:', opts.configuration);
  console.log(configurationData);
  console.log('Credentials file:', configurationData.sourceCredentials);
  console.log(credentialsData);
}
(async () => {
  let ably = new Ably.Realtime({
    key: credentialsData.ablyApiKey,
    clientId: CLIENT_ID,
  });

  let channel = ably.channels.get(`${CHANNEL_PREFIX}${configurationData.sourceTrackableId}`);
  if (opts.verbose) console.log('Channel:', channel.name);

  if (opts.verbose) console.log('Downloading location data from Ably channel history...');
  const messages = await getEnhancedLocationsFromChannelHistory(channel);
  if (opts.verbose) {
    console.log('Location data downloaded');
    console.log(messages);
  }

  if (opts.verbose) console.log('Entering presence...');
  await channel.presence.enter(PRESENCE_DATA);
  if (opts.verbose) console.log('Presence entered');

  if (opts.verbose) console.log(`Publishing location messages...`);
  for (let i = 0; i < messages.length; i++) {
    console.log(`Publishing location ${i}`);
    const message = messages[i];
    await channel.publish(ENHANCED_LOCATION_MESSAGE, JSON.stringify(message));
    const isLastMessage = i === messages.length - 1;
    if (!isLastMessage) {
      const nextMessage = messages[i + 1];
      const delayBetweenMessagesInSeconds = nextMessage.location.properties.time - message.location.properties.time;
      if (opts.verbose) console.log('Delay:', delayBetweenMessagesInSeconds);
      await wait(delayBetweenMessagesInSeconds);
    }
  }
  if (opts.verbose) console.log(`Finished publishing location messages`);

  if (opts.verbose) console.log('Leaving presence...');
  await channel.presence.leave(PRESENCE_DATA);
  if (opts.verbose) console.log('Presence left');

  ably.close();

  process.exit(0);
})();
