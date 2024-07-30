const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('morpion')
        .setDescription('Obtenez le lien pour jouer au jeu de morpion.'),
    async execute(interaction) {
        await interaction.reply({ content: 'Cliquez sur ce lien pour jouer au morpion: http://localhost:3000/morpion.html', ephemeral: true });
    }
};
