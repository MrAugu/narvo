# Narvo
A small in-building framework for discord.js bots.

# Example
```js
const { Client } = require("narvo");

const client = new Client({
  commandsDirectory: "./commands",
  eventsDirectory: "./events",
  prefix: "-",
  mentionPrefix: false,
  botOwner: "414764511489294347",
  botAdmins: []
});

client.on("ready", () => client.logger.ready("Ready Bot!"));

client.login("SECRET_TOKEN");
```
