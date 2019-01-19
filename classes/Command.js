class Command {
  constructor (client, {
    name = undefined,
    description = "No description provided.",
    category = "No category provided.",
    aliases = [],
    usage = null,
    enabled = true,
    hidden = false,
    permLevel = 0,
    botPerms = ["SEND_MESSAGES"],
    cooldown = 0,
    args = false
  }) {
    this.client = client;
    this.info = { name, description, category, usage };
    this.configuration = { aliases, enabled, hidden, permLevel, botPerms, cooldown, args };
  }
}

module.exports = Command;