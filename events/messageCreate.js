const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.textCommands.get(commandName);

        if (!command) return;

        try {
            command.executeMessage(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Il y a eu une erreur en exécutant cette commande!');
        }
    },
};
