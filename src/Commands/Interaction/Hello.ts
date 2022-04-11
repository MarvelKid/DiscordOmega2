import type DiscordBot from 'Structures/DiscordBot.js';
import type { CommandInteraction } from 'discord.js';
import ApplicationCommand from '../../Structures/Registries/ApplicationCommand.js';

export = class HelloCommand extends ApplicationCommand {
  private constructor(client: DiscordBot) {
    super(client, 'hello', {
      description: 'Hello World!',
      cooldown: 10,
    });
  }

  public async run(interaction: CommandInteraction): Promise<void> {
    try {
      return await interaction.reply({ content: 'Hello!' });
    } catch (error) {
      console.error(error);
    }
  }
};
