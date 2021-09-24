const Discord = require("discord.js")
const messages = require("../storage/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Start a giveaway',

  options: [
    {
      name: 'duration',
      description: 'How long the giveaway should last for. Example values: 1m, 1h, 1d',
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
    },
    {
      name: 'channel',
      description: 'The channel to start the giveaway in',
      type: 'CHANNEL',
      required: true
    },
    {
      name: 'role',
      description: 'Name of the role which would recieve bonus entries',
      type: 'STRING',
      required: false
    },
    {
      name: 'amount',
      description: 'The amount of bonus entries the role will recieve',
      type: 'INTEGER',
      required: false
    },
    {
      name: 'invite',
      description: 'Invite of the server you want to add as giveaway joining requirement',
      type: 'STRING',
      required: false
    },
    {
      name: 'rolereq',
      description: 'Name of the role you want to add as giveaway joining requirement',
      type: 'STRING',
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: You need to have the manage messages permissions to start giveaways.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ':x: Please select a text channel!',
        ephemeral: true
      });
    }
    const bonusRole = interaction.options.getString('role')
    const bonusEntries = interaction.options.getInteger('amount')
    let rolereq = interaction.options.getString('rolereq')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      const x = await interaction.guild.roles.cache.find(
        n => n.name === `${bonusRole}`
      );
      if (!x) {
        return interaction.reply({
          content: ':x: No such role found!',
          ephemeral: true
        });
      }
    }

let reqrole;
    if(rolereq){
      const x = await interaction.guild.roles.cache.find(
        n => n.name === `${rolereq}`
      );
      reqrole = x 
      if (!x) {
        return interaction.reply({
          content: ':x: No such role found!',
          ephemeral: true
        });
      }
    }
    let reqinvite;
    if(invite){
     await client.fetchInvite(invite).then(invitex => {
        let client_is_in_server = client.guilds.cache.get(
          invitex.guild.id
        )
        reqinvite = invitex
        if (!client_is_in_server) {
          return interaction.reply({
            embeds: [{
              color: "#2F3136",
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Server Check!",
              url: "https://youtube.com/c/ZeroSync",
              description:
                "Woah woah woah! I see a new server! are you sure I am in that? You need to invite me there to set that as a requirement! 😳",
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: "Server Check"
              }
            }]
          })
        }
      })
     }
        interaction.deferReply({ ephemeral: true })


        // start giveaway
        await client.giveawaysManager.start(giveawayChannel, {
          // The giveaway duration
          duration: ms(giveawayDuration),
          // The giveaway prize
          prize: giveawayPrize,
          // The giveaway winner count
          winnerCount: parseInt(giveawayWinnerCount),
          // BonusEntries If Provided
          bonusEntries: [
            {
              // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
              bonus: new Function(
                "member",
                `member.roles.cache.some((r) => r.name === \'${bonusRole}\') ? ${bonusEntries}: null`
              ),
              cumulative: false
            }
          ],
          // Messages
          messages,
          extraData: {
            server: reqinvite == null ? "null" : reqinvite.guild.id,
            role: reqrole == null ? "null" : reqrole.id,
          }
        });
        interaction.editReply({
          content:
            `Giveaway started in ${giveawayChannel}!`,
          ephemeral: true
        })
        
    if (bonusRole) {
      const mentionfetch = await interaction.guild.roles.cache.find(
        n => n.name === `${bonusRole}`
      );
      let giveaway = new Discord.MessageEmbed()
        .setAuthor(`Bonus Enteries Alert!`)
        .setDescription(
          `**${mentionfetch}** Has **${bonusEntries}** Extra Enteries in this giveaway!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};