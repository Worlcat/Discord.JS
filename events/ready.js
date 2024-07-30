const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const RPC = require('discord-rpc');

const clientId = config.clientId;
const rpc = new RPC.Client({ transport: 'ipc' });

RPC.register(clientId);

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setPresence({
            activities: [{ name: 'discord.gg/Meow Meow', type: ActivityType.Watching }],
            status: 'online',
        });

        // Connect to the RPC client
        rpc.on('ready', () => {
            console.log('Présence Discord RPC prête !');

            rpc.setActivity({
                details: 'Competitive',
                state: 'Discord.gg/Meow Meow',
                startTimestamp: 1507665886,
                endTimestamp: 1507665886,
                largeImageKey: 'landscape_comp',
                largeImageText: 'Worlcat',
                smallImageKey: 'meow',
                smallImageText: 'Edit Code JS',
                partyId: 'ae488379-351d-4a4f-ad32-2b9b01c91657',
                partySize: 1,
                partyMax: 9999,
                instance: true,
                buttons: [
                    {
                        label: 'Invite Bot',
                        url: `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8`
                    }
                ]
            });
        });

        rpc.login({ clientId }).catch(console.error);

        const guild = client.guilds.cache.get(config.guildId);
        const channel = guild.channels.cache.get(config.channelId);
        let message;

        if (config.messageId) {
            try {
                message = await channel.messages.fetch(config.messageId);
            } catch (error) {
                console.error('Message non trouvé, Création du nouveau message.');
            }
        }

        if (!message) {
            const embed = new EmbedBuilder()
                .setTitle('Rôles par réaction')
                .setDescription('Cliquez sur les boutons ci-dessous pour obtenir les rôles correspondants:')
                .setColor('#0099ff');

            const buttons = config.roles.map((role) => {
                embed.addFields({
                    name: `${role.emoji} ${role.name}`,
                    value: `<@&${role.id}>`,
                    inline: true
                });

                // Gestion des emojis personnalisés
                const emoji = role.emoji.match(/<:.*:(\d+)>/) ? { id: role.emoji.match(/<:.*:(\d+)>/)[1] } : { name: role.emoji };

                return new ButtonBuilder()
                    .setCustomId(`role_button_${role.id}`)
                    .setLabel(role.name)
                    .setEmoji(emoji)
                    .setStyle(ButtonStyle.Primary);
            });

            const row = new ActionRowBuilder().addComponents(buttons);

            message = await channel.send({
                embeds: [embed],
                components: [row]
            });

            config.messageId = message.id;
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Rôles par réaction')
                .setDescription('Cliquez sur les boutons ci-dessous pour obtenir les rôles correspondants:')
                .setColor('#0099ff');

            config.roles.forEach(role => {
                embed.addFields({
                    name: `${role.emoji} ${role.name}`,
                    value: `<@&${role.id}>`,
                    inline: true
                });
            });

            const buttons = config.roles.map((role) => {
                const emoji = role.emoji.match(/<:.*:(\d+)>/) ? { id: role.emoji.match(/<:.*:(\d+)>/)[1] } : { name: role.emoji };

                return new ButtonBuilder()
                    .setCustomId(`role_button_${role.id}`)
                    .setLabel(role.name)
                    .setEmoji(emoji)
                    .setStyle(ButtonStyle.Primary);
            });

            const row = new ActionRowBuilder().addComponents(buttons);

            await message.edit({
                embeds: [embed],
                components: [row]
            });
        }

        // Create the ticket menu
        const ticketChannel = guild.channels.cache.get(config.ticketChannelId);
        let ticketMessage;

        if (config.ticketMessageId) {
            try {
                ticketMessage = await ticketChannel.messages.fetch(config.ticketMessageId);
            } catch (error) {
                console.error('Ticket message non trouvé, Création du nouveau message.');
            }
        }

        if (!ticketMessage) {
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ouvrir un ticket')
                .setDescription('Sélectionnez une option dans le menu déroulant pour ouvrir un ticket.')
                .setColor('#0099ff');

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('ticket_select')
                .setPlaceholder('Sélectionnez une option')
                .addOptions([
                    {
                        label: 'Support',
                        description: 'Ouvrir un ticket de support',
                        value: 'support'
                    },
                    {
                        label: 'Réclamation',
                        description: 'Ouvrir un ticket de réclamation',
                        value: 'reclamation'
                    },
                    // Ajoutez d'autres options si nécessaire
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            ticketMessage = await ticketChannel.send({
                embeds: [ticketEmbed],
                components: [row]
            });

            config.ticketMessageId = ticketMessage.id;
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        }
    },
};
