module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (user.bot) return;

        const { message, emoji } = reaction;
        const member = message.guild.members.cache.get(user.id);

        if (emoji.name === '👍') {
            member.roles.remove('ROLE_ID_1'); 
        } else if (emoji.name === '👎') {
            member.roles.remove('ROLE_ID_2');
        }
    }
};
