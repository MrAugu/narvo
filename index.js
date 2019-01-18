const Client = require("./classes/NarvoClient");
const metaData = require("./package.json");

module.exports = {
  Client: Client,
  version: `v${metaData.version}`,
  realVersion: metaData.version
};