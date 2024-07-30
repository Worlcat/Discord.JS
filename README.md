# Discord.JS

Discord Rich Presence Configuration

To set up Discord Rich Presence in your ready.js file, follow these steps:

    Configure the RPC Client

    In your ready.js file, add the following code to connect to the RPC client and set up the activity:


const { ActivityType } = require('discord.js');
const RPC = require('discord-rpc');
const config = require('../config.json');

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
                state: 'Playing Solo',
                startTimestamp: 1507665886,
                endTimestamp: 1507665886,
                largeImageKey: 'numbani', // Ensure this key matches an image uploaded on your Discord application
                largeImageText: 'Numbani',
                smallImageKey: 'rogue_level_100', // Ensure this key matches an image uploaded on your Discord application
                smallImageText: 'Rogue - Level 100',
                partyId: 'ae488379-351d-4a4f-ad32-2b9b01c91657',
                partySize: 1,
                partyMax: 5,
                joinSecret: 'MTI4NzM0OjFpMmhuZToxMjMxMjM=',
                buttons: [
                    {
                        label: 'Join Us',
                        url: `https://discord.gg/YOUR_INVITE_CODE`
                    }
                ]
            });
        });

        rpc.login({ clientId }).catch(console.error);
    },
};




Example C Code for Discord Rich Presence

Here is an example of how you might configure Discord Rich Presence using C:


static void UpdatePresence()
{
    DiscordRichPresence discordPresence;
    memset(&discordPresence, 0, sizeof(discordPresence));
    discordPresence.state = "Playing Solo";
    discordPresence.details = "Competitive";
    discordPresence.startTimestamp = 1507665886;
    discordPresence.endTimestamp = 1507665886;
    discordPresence.largeImageText = "Numbani";
    discordPresence.smallImageText = "Rogue - Level 100";
    discordPresence.partyId = "ae488379-351d-4a4f-ad32-2b9b01c91657";
    discordPresence.partySize = 1;
    discordPresence.partyMax = 5;
    discordPresence.joinSecret = "MTI4NzM0OjFpMmhuZToxMjMxMjM= ";
    Discord_UpdatePresence(&discordPresence);
}
