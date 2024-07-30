const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Affiche des informations sur le serveur'),
    async execute(interaction) {
        const guild = interaction.guild;

        const totalMembers = guild.memberCount;
        const bots = guild.members.cache.filter(member => member.user.bot).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size; 
        const categories = guild.channels.cache.filter(channel => channel.type === 4).size; 
        const roles = guild.roles.cache.size;
        const owner = await guild.fetchOwner();
        const creationDate = guild.createdAt.toLocaleDateString();

        const embed = new EmbedBuilder()
            .setTitle('📊 Informations du Serveur')
            .setColor('#0099ff')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👑 Propriétaire', value: `<@${owner.id}>`, inline: true },
                { name: '📅 Date de création', value: `${creationDate}`, inline: true },
                { name: '🔢 Nombre de rôles', value: `${roles}`, inline: true },
                { name: '👥 Nombre de membres', value: `${totalMembers}`, inline: true },
                { name: '🤖 Nombre de bots', value: `${bots}`, inline: true },
                { name: '🔊 Canaux vocaux', value: `${voiceChannels}`, inline: true },
                { name: '💬 Canaux texte', value: `${textChannels}`, inline: true },
                { name: '📂 Catégories', value: `${categories}`, inline: true }
            )
            .setFooter({ text: `🆔 ID du serveur : ${guild.id}` });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
