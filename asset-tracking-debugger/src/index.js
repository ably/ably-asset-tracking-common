#!/usr/bin/env node
const { Command } = require("commander");
const version = require("../package.json").version;
const Ably = require("ably");
const inquirer = require("inquirer");
const getDataFromPath = require("./getDataFromPath");
require('dotenv').config();

if (!process.env.ABLY_API_KEY) {
	console.error('This CLI requires the ABLY_API_KEY environment variable');
	process.exit(1);
}

const program = new Command();

program.version(version);

program.option("-s, --source <file>", "recorded journey JSON file");
program.option("-y, --yes", "use default settings");
program.option("-l, --loop", "publish journey locations on an infinite loop");
program.option(
  "-i, --interval <ms>",
  "interval between each location update (in milliseconds)"
);
program.option("-v, --verbose", "enable verbose logging");
program.option("-p, --presence", "display subscriber presence events");

program.parse(process.argv);

const opts = program.opts();

const data = getDataFromPath(opts.source);

if (opts.verbose) {
  console.log(`Source file: ${opts.source}`);
  console.log(data);
}

(async () => {
  const { channel: channelInput, clientId, msgType } = opts.yes
    ? {}
    : await inquirer.prompt([
        {
          type: "input",
          name: "channel",
          message: 'Please enter a channel name (default is "ivan")',
        },
        {
          type: "input",
          name: "clientId",
          message:
            'Please enter a client ID (default is "asset-tracking-debugger")',
        },
        {
          type: "list",
          name: "msgType",
          message: "Please select a message type",
          choices: ["enhanced", "raw"],
        },
      ]);

  if (opts.verbose) {
    console.log(`Channel: ${channelInput || "ivan"}`);
    console.log(`Client ID: ${clientId || "asset-tracking-debugger"}`);
  }

  const realtime = new Ably.Realtime.Promise({
    key: process.env.ABLY_API_KEY,
    clientId: clientId || "asset-tracking-debugger",
  });

  const channel = realtime.channels.get(channelInput || "ivan");

  if (opts.verbose) console.log(`Entering presence`);
  await channel.presence.enter({
    type: "publisher",
  });
  if (opts.verbose) console.log(`Presence entered`);

  if (opts.presence) {
    console.log(await channel.presence.get());

    channel.presence.subscribe("update", console.log);
    channel.presence.subscribe("leave", console.log);
    channel.presence.subscribe("enter", console.log);
  }

  console.log(`Publishing location messages...`);

  let indexPointer = 0;
  setInterval(async () => {
    if (opts.verbose) console.log(`Publishing location ${indexPointer}`);
    await channel.publish(msgType || "enhanced", {
      location: data.locationUpdates[indexPointer],
      intermediateLocations: [],
      type: "ACTUAL",
    });
    indexPointer++;
    if (indexPointer === data.locationUpdates.length) {
      if (opts.loop) {
        indexPointer = 0;
      } else {
        console.log(`Finished publishing location messages`);
        realtime.close();
        process.exit(0);
      }
    }
  }, opts.interval || 1000);
})();
