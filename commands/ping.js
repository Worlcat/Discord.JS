const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Coucou mec'),
    async execute(interaction) {
        await interaction.reply('');
    },
};
