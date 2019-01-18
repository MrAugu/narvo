const { Client, Collection } = require("discord.js");
const Ora = require("ora");
const path = require("path");
const klaw = require("klaw"); // eslint-disable-line no-unused-vars
const readdir = require("util").promisify(require("fs").readdir); // eslint-disable-line no-unused-vars

class NarvoClient extends Client {
  constructor (options) {
    super(options);

    /**
     * Category: Client Configuration
     * @property {string} commandsDirectory - Path of the folder command files are in.
     * @property {string} eventsDirectory - Path of the folder event files are in.
     * @property {string} prefix - Prefix your bot can be called with.
     * @property {boolean} mentionPrefix - Wether your bot can be called both with prefix and mention.
     * @property {string} botOwner - An id of bot's owner.
     * @property {object} botAdmins - An array of bot's admins IDs.
     * @property {object} clientOptions - Discord's Client options such as disableEveryone, fetchAllMembers, etc are being placed in clientOptions object.
    */


    this.commandsDirectory = options.commandsDirectory || null;
    this.eventsDirectory = options.eventsDirectory || null;
    this.prefix = options.prefix || ".";
    this.mentionPrefix = options.mentionPrefix || false;
    this.botOwner = options.botOwner || null;
    this.botAdmins = options.botAdmins || [];
    this.clientOptions = options.clientOptions || {};
    
    if (typeof this.commandsDirectory !== "string") throw new TypeError("this.client.options.commandsDirectory must be a string.");
    if (typeof this.eventsDirectory !== "string") throw new TypeError("this.client.options.eventsDirectory must be a string.");
    if (typeof this.prefix !== "string") throw new TypeError("this.client.options.prefix must be a string.");
    if (typeof this.mentionPrefix !== "boolean") throw new TypeError("this.client.options.mentionPrefix must be a boolean.");
    if (typeof this.botOwner !== "string") throw new TypeError("this.client.options.botOwner must be a string.");
    if (typeof this.botAdmins !== "object") throw new TypeError("this.client.options.botAdmins must be a object.");
    if (typeof this.clientOptions !== "object") throw new TypeError("this.client.options.clientOptions must be an object.");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.logger = Ora;
  }

  isOwner (id) {
    if (id === this.botOwner) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin (id) {
    if (this.botAdmins.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param {string} cmdPath - Location of the command to be loaded. 
   * @param {string} cmdName - Name of command its being loaded.
  */

  async loadCommand (cmdPath, cmdName) {
    try {
      const props = new (require(`${cmdPath}${path.sep}${cmdName}`))(this);
      const log = this.logger(`Loading Cmd: ${props.help.name}`).start();

      setTimeout(() => {
        log.succeed(`Loaded Command: ${props.help.name}`);
      }, 1500);

      props.conf.location = cmdPath;

      if (props.init) {
        props.init(this);
      }

      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });

      return false;
    } catch (e) {
      return `Command ${cmdName} can't be reloaded beacuse ${e}`;
    }
  }

  /**
   * @param {string} cmdPath - Location of the command to be unloaded. 
   * @param {string} cmdName - Name of command its being unloaded.
   */

  async unloadCommand (cmdPath, cmdName) {
    let command;

    if (this.commands.has(cmdName)) {
      command = this.commands.get(cmdName);
    } else if (this.aliases.has(cmdName)) {
      command = this.commands.get(this.aliases.get(cmdName));
    }

    if (!command) return `The command \`${cmdName}\` dosen't exist.`;

    if (command.shutdown) {
      await command.shutdown(this);
    }

    delete require.cache[require.resolve(`${cmdPath}${path.sep}${cmdName}.js`)];
    return false;
  }

  /**
   * @param {DiscordClient} client - The discord client object. 
   */

  // Initialization should be moved to other file, and paths fixed. In this measure module its unable to reach command and event folders specified.

  /* async initialize (client) {
    klaw(this.commandsDirectory).on("data", (item) => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== ".js") return;
      const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
      if (response) client.logger.error(response);
    });
  
    const evtFiles = await readdir(this.eventsDirectory);
    const log1 = client.logger(`Loading a total of ${evtFiles.length} events.`).start();
    log1.succeed(`Loading a total of ${evtFiles.length} events.`);

    evtFiles.forEach(file => {
      console.log(file);
      const eventName = file.split(".")[0];
      const log2 = client.logger(`Loading Event: ${eventName}`).start();

      setTimeout(() => {
        log2.succeed(`Loaded Event: ${eventName}`);
      }, 1500);

      const event = new (require(`${this.eventsDirectory}/${file}`))(client);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${this.eventsDirectory}/${file}`)];
    });
  }*/

  /**
   * @param {DiscordClient} client - The client itself.
   * @param {string} text - Text to be displayed as pesence.
   * @param {*} type - Type of presence. (Such as WATCHING, etc.)
   */

  async setGamePresence (client, text, type) {
    try {
      await client.user.setActivity(text, { type: type });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

module.exports = NarvoClient;