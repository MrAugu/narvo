module.exports = {
  // Client
  Client: require("./classes/NarvoClient"),
  NarvoClient: require("./classes/NarvoClient"),

  // Commands
  Command: require("./classes/Command"),
  NarvoCommand: require("./classes/Command"),

  // Metadata
  version: require("./package.json").version,
  author: require("./package.json").author
};