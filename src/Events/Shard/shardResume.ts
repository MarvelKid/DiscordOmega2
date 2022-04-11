import type DiscordBot from '../../Structures/DiscordBot';
import type { APIMessage } from 'discord-api-types/v9';
import { MessageEmbed, Formatters } from 'discord.js';
import Event from '../../Structures/Registries/Event';

export = class ShardResumeEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'shardResume', {
      description: 'Emitted when a shard resumes successfully.',
    });
  }

  public async run(id: number, replayedEvents: number): Promise<APIMessage | undefined> {
    const embed = new MessageEmbed()
      .setTitle('Shard Reconnecting')
      .setDescription(
        `${Formatters.bold('Shard ID')}: ${Formatters.inlineCode(
          id.toLocaleString()
        )}\n${Formatters.bold('Replayed Events')}: ${Formatters.inlineCode(
          replayedEvents.toLocaleString()
        )}`
      )
      .setColor('DARK_GREEN')
      .setTimestamp();

    try {
      return await this.client.webhookLoggerClient.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
