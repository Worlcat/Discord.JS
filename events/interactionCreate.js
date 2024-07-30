const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const client = interaction.client;
        const guild = client.guilds.cache.get(config.guildId);

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket_select') {
                const userTickets = guild.channels.cache.filter(channel => 
                    channel.type === ChannelType.GuildText && 
                    channel.name.startsWith(`ticket-${interaction.user.username}`)
                );

                if (userTickets.size >= 2) {
                    return interaction.reply({ content: "Vous avez déjà atteint la limite de 2 tickets ouverts.", ephemeral: true });
                }

                const category = guild.channels.cache.get(config.ticketCategoryId);
                const ticketChannel = await guild.channels.create({
                    name: `ticket-${interaction.user.username}-${userTickets.size + 1}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: config.staffRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                await interaction.reply({ content: `Votre ticket a été créé: ${ticketChannel}`, ephemeral: true });

                const ticketEmbed = new EmbedBuilder()
                    .setTitle('Ticket')
                    .setDescription('Expliquez votre problème ici. Un membre du staff vous répondra bientôt.')
                    .setColor('#0099ff');

                const closeButton = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fermer le ticket')
                    .setStyle(ButtonStyle.Danger);

                const transcriptButton = new ButtonBuilder()
                    .setCustomId('transcript_ticket')
                    .setLabel('Transcrire le ticket')
                    .setStyle(ButtonStyle.Secondary);

                const row = new ActionRowBuilder().addComponents(closeButton, transcriptButton);

                await ticketChannel.send({
                    embeds: [ticketEmbed],
                    components: [row]
                });
            }
        } else if (interaction.isButton()) {
            const channel = interaction.channel;

            if (interaction.customId === 'close_ticket') {
                if (!interaction.member.roles.cache.has(config.staffRoleId) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "Vous n'avez pas la permission de fermer ce ticket.", ephemeral: true });
                }

                const responseEmbed = new EmbedBuilder()
                    .setTitle('Channel Suppression')
                    .setDescription('Ce channel sera supprimé dans 5 secondes.')
                    .setColor('#ff0000');

                await interaction.reply({ embeds: [responseEmbed] });

                setTimeout(async () => {
                    await channel.delete();
                }, 5000);

            } else if (interaction.customId === 'transcript_ticket') {
                if (!interaction.member.roles.cache.has(config.staffRoleId) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: "Vous n'avez pas la permission de transcrire ce ticket.", ephemeral: true });
                }

                let transcript = '';
                const messages = await channel.messages.fetch({ limit: 100 });
                messages.reverse().forEach(msg => {
                    transcript += `${msg.author.tag}: ${msg.content}\n`;
                });

                fs.writeFileSync(`./transcripts/${channel.id}.txt`, transcript);

                const responseEmbed = new EmbedBuilder()
                    .setTitle('Transcription')
                    .setDescription(`La transcription du ticket a été enregistrée.`)
                    .setColor('#00ff00');

                await interaction.reply({ embeds: [responseEmbed], files: [`./transcripts/${channel.id}.txt`] });
            }
        }
    },
};
