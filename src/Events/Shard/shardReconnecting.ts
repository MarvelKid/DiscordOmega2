import type DiscordBot from '../../Structures/DiscordBot';
import type { APIMessage } from 'discord-api-types/v9';
import { MessageEmbed, Formatters } from 'discord.js';
import Event from '../../Structures/Registries/Event';

export = class ShardReconnectingEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'shardReconnecting', {
      description: 'Emitted when a shard is attempting to reconnect or re-identify.',
    });
  }

  public async run(id: number): Promise<APIMessage | undefined> {
    const embed = new MessageEmbed()
      .setTitle('Shard Reconnecting')
      .setDescription(
        `${Formatters.bold('Shard ID')}: ${Formatters.inlineCode(id.toLocaleString())}`
      )
      .setColor('YELLOW')
      .setTimestamp();

    try {
      return await this.client.webhookLoggerClient.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
