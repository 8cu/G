const Discord = require("discord.js")
const messages = require("../storage/message");
const ms = require("ms")
module.exports = {
    name: 'edit',
    description: '🎉 Edit a giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to end (message ID)',
            type: 'STRING',
            required: true
        },
        {
            name: 'duration',
            description: 'Adding time to the mentioned giveaway. Eg. 1h ( Adds 1 hour to the current duration )',
            type: 'STRING',
            required: true
        },
        {
            name: 'winners',
            description: 'How many winners the giveaway should have',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prize',
            description: 'What the prize of the giveaway should be',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: You need to have the manage messages permissions to start giveaways.',
                ephemeral: true
            });
        }
        const gid = interaction.options.getString('giveaway');
        const time = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        if (!giveawayChannel.isText()) {
            return interaction.reply({
                content: ':x: Please select a text channel!',
                ephemeral: true
            });
        }

        // Start the giveaway
        await client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
        })
        interaction.reply({
            content:
                `Giveaway started in ${giveawayChannel}!`,
            ephemeral: true
        });
    }

};
