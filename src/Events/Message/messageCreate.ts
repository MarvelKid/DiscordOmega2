import type DiscordBot from '../../Structures/DiscordBot';
import { Collection, Formatters, type Message, MessageEmbed } from 'discord.js';
import { stripIndent } from 'common-tags';
import { setTimeout } from 'timers/promises';
import Event from '../../Structures/Registries/Event';

export = class MessageCreateEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'messageCreate', {
      description: 'Emitted whenever a message is created.',
    });
  }

  public async run(message: Message) {
    if (!this.client.isReady() || message.author.bot) return;

    const mentionRegex = new RegExp(`^<@!?${this.client.user.id}>$`);

    const mentionRegexPrefix = new RegExp(`^<@!?${this.client.user.id}> `);

    if (message.partial) {
      const msg = await message.fetch();

      message = msg;
    }

    try {
      if (message.content.match(mentionRegex)) {
        await message.channel.send(`Sup nerds!\nMy name is ${this.client.user.username}!`);
      }

      const prefixRegexMatch = message.content.match(mentionRegexPrefix);

      const prefix = prefixRegexMatch ? prefixRegexMatch[0] : this.client.defaultPrefix;

      if (!message.content.startsWith(prefix)) return;

      const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

      const command =
        this.client.commands.message.get(commandName.toLowerCase()) ||
        this.client.commands.message.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase())
        );

      if (command) {
        if (command.args && !args.length) {
          return await message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle('Missing Argument!')
                .setDescription(
                  `You are missing at least one argument to run this command!\nUsage:\n${
                    Array.isArray(command.usage)
                      ? command.usage.map((usage) => Formatters.inlineCode(usage)).join('\n')
                      : Formatters.bold(command.usage)
                  }`
                )
                .setColor(0x7289da)
                .setTimestamp(),
            ],
          });
        }

        if (message.inGuild()) {
          if (
            command.memberPermissions &&
            message.member &&
            !message.member.permissions.has([...new Set(command.memberPermissions)], true)
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

            return await message.reply({ embeds: [embed] });
          }

          const permission = command.botPermissions
            ? command.botPermissions.concat(this.client.defaultPermissions)
            : this.client.defaultPermissions;

          if (
            message.guild.me &&
            !message.guild.me.permissions.has([...new Set(permission)], true)
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

            return await message.reply({ embeds: [embed] });
          }
        }

        if (command.guildOnly && !message.inGuild()) {
          return await message.reply({
            content: 'This command can only be ran in a cached guild.',
          });
        }

        if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
          return await message.reply({
            content: `This command can only be ran by ${
              this.client.owners.length === 1
                ? 'an authorized bot developer'
                : 'authorized bot developers'
            }.`,
          });
        }

        if (command.cooldown) {
          const cooldownAmount = command.cooldown * 1000;

          if (!this.client.commands.cooldowns.has(command.name)) {
            this.client.commands.cooldowns.set(command.name, new Collection());
          }

          const now = Date.now();

          const timestamps = this.client.commands.cooldowns.get(command.name);

          if (!timestamps) return;

          if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;

              return await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setDescription(
                      `:x: You have to wait  ${Formatters.bold(
                        Math.ceil(timeLeft).toLocaleString()
                      )} seconds before running this command again!`
                    )
                    .setColor('RED'),
                ],
              });
            }
          }

          timestamps.set(message.author.id, now);

          setTimeout(cooldownAmount).then(() => timestamps.delete(message.author.id));
        }

        command.run(message, args);
      }
    } catch (error) {
      console.error(error);

      return await message.reply({
        content: `An error occured while attempting to execute this action!\n${
          this.client.utils.checkOwner(message.author.id)
            ? `Error: ${Formatters.codeBlock('ts', error as string)}`
            : new String().toString()
        }`,
      });
    }
  }
};
