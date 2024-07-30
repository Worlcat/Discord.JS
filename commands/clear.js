const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre spécifié de messages d\'un canal. (1-99)')
        .addIntegerOption(option => 
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer (1-99)')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('nombre');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
        }

        if (amount < 1 || amount > 99) {
            return interaction.reply({ content: 'Veuillez entrer un nombre entre 1 et 99.', ephemeral: true });
        }

        const embedInitial = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Commande Clear')
            .setDescription(`Suppression de ${amount} messages dans 5 secondes...`)
            .setTimestamp();

        await interaction.reply({ embeds: [embedInitial], fetchReply: true });

        setTimeout(async () => {
            try {
                await interaction.channel.bulkDelete(amount, true);

                const embedFinal = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Commande Clear')
                    .setDescription(`Suppression de ${amount} messages réussie.`)
                    .setTimestamp();

                await interaction.followUp({ embeds: [embedFinal], ephemeral: true });
            } catch (error) {
                console.error(error);
                const embedError = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Erreur')
                    .setDescription('Une erreur est survenue lors de la suppression des messages dans ce canal !')
                    .setTimestamp();
                await interaction.followUp({ embeds: [embedError], ephemeral: true });
            }
        }, 5000);
    }
};
