import type DiscordBot from '../../Structures/DiscordBot';
import { Collection, Formatters, type Interaction, MessageEmbed } from 'discord.js';
import { stripIndent } from 'common-tags';
import { setTimeout } from 'timers/promises';
import Event from '../../Structures/Registries/Event';

export = class InteractionCreateEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'interactionCreate', {
      description: 'Emitted whenever a message is created.',
    });
  }

  public async run(interaction: Interaction) {
    if (!this.client.isReady() || interaction.user.bot || !interaction.channel) return;

    try {
      if (interaction.isCommand()) {
        const command = this.client.commands.application.get(interaction.commandName.toLowerCase());

        if (command) {
          if (interaction.inCachedGuild()) {
            if (
              command.memberPermissions &&
              !interaction.member.permissions.has([...new Set(command.memberPermissions)], true)
            ) {
              const embed = new MessageEmbed()
                .setTitle('Missing Permissions')
                .setDescription(
                  stripIndent`You are missing the required ${
                    command.memberPermissions.length === 1 ? 'permission' : 'permissions'
                  } to execute this command.\nYou require the following permission${
                    command.memberPermissions.length === 1 ? ':' : 's:'
                  } ${command.memberPermissions
                    .map((p) => this.client.utils.formatPermissions(p))
                    .join(', ')}.`
                )
                .setColor(0x7289da)
                .setTimestamp();

              return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const permission = command.botPermissions
              ? command.botPermissions.concat(this.client.defaultPermissions)
              : this.client.defaultPermissions;

            if (
              interaction.guild.me &&
              !interaction.guild.me.permissions.has([...new Set(permission)], true)
            ) {
              const embed = new MessageEmbed()
                .setTitle('Missing Permissions')
                .setDescription(
                  stripIndent`I am missing the required ${
                    permission.length === 1 ? 'permission' : 'permissions'
                  } to execute this command.\nI require the following permission${
                    permission.length === 1 ? ':' : 's:'
                  } ${permission.map((p) => this.client.utils.formatPermissions(p)).join(', ')}.`
                )
                .setColor(0x7289da)
                .setTimestamp();

              return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
          }

          if (command.guildOnly && !interaction.inCachedGuild()) {
            return await interaction.reply({
              content: 'This command can only be ran in a cached guild.',
              ephemeral: true,
            });
          }

          if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
            return await interaction.reply({
              content: `This command can only be ran by ${
                this.client.owners.length === 1
                  ? 'an authorized bot developer'
                  : 'authorized bot developers'
              }.`,
              ephemeral: true,
            });
          }

          if (command.cooldown) {
            const cooldownAmount = command.cooldown;

            if (!this.client.commands.cooldowns.has(command.name)) {
              this.client.commands.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();

            const timestamps = this.client.commands.cooldowns.get(command.name);

            if (!timestamps) return;

            if (timestamps.has(interaction.user.id)) {
              const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                return await interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setDescription(
                        `:x: You have to wait  ${Formatters.bold(
                          Math.ceil(timeLeft).toLocaleString()
                        )} seconds before running this command again!`
                      )
                      .setColor('RED'),
                  ],
                  ephemeral: true,
                });
              }
            }

            timestamps.set(interaction.user.id, now);

            setTimeout(cooldownAmount).then(() => timestamps.delete(interaction.user.id));
          }

          command.run(interaction);
        } else {
          console.log('lol');
        }
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
