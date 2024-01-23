"use strict";

const yargs = require("yargs");
const { prompt } = require("enquirer");
const Configstore = require("configstore");
const axios = require("axios");

const config = new Configstore("slack-cli");
const url = "https://slack.com/api/chat.postMessage";

yargs.command(
  "postMessage [message]",
  "Send a message",
  (yargs) => {
    yargs.positional("channel", {
      describe: "Channel to sed message to",
      default: "test",
    });
  },
  async function hanlder(argv) {
    const token = config.get("token");
    if (!token) {
      return console.log("Must be logged in!");
    }
    const data = {
      channel: "#" + argv.channel,
      text: argv.message,
    };
    console.log("🚀 ~ hanlder ~ data:", data);
    const headers = { authorization: `Bearer ${token}` };
    const res = await axios.post(url, data, { headers });
    console.log("🚀 ~ hanlder ~ headers:", headers);
    if (!res.data.ok) {
      return console.log("Error:", res.data.error);
    }
    console.log(`Sent message to channel #${argv.channel}: ${argv.message}`);
  }
);

yargs.command(
  "login",
  "Set your bot token",
  () => {},
  async function handler(argv) {
    const { token } = await prompt({
      type: "password",
      name: "token",
      message: "Enter your Slack bot token:",
    });
    config.set({ token });
    console.log("Token stored successfully!");
  }
);

yargs.argv;
