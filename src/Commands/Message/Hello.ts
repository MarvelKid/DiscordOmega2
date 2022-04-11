import type DiscordBot from 'Structures/DiscordBot.js';
import type { Message } from 'discord.js';
import MessageCommand from '../../Structures/Registries/MessageCommand.js';

export = class HelloCommand extends MessageCommand {
  private constructor(client: DiscordBot) {
    super(client, 'hello', {
      aliases: ['hallo'],
      cooldown: 5,
    });
  }

  public async run(message: Message): Promise<Message<boolean> | undefined> {
    try {
      return await message.channel.send({ content: 'Hello!' });
    } catch (error) {
      console.error(error);
    }
  }
};
