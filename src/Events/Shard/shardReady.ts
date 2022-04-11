import type DiscordBot from '../../Structures/DiscordBot';
import type { APIMessage } from 'discord-api-types/v9';
import { type Snowflake, MessageEmbed, Formatters } from 'discord.js';
import Event from '../../Structures/Registries/Event';

export = class ShardReadyEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'shardReady', {
      description: 'Emitted when a shard turns ready.',
    });
  }

  public async run(
    id: number,
    unavailableGuilds: Set<Snowflake> | null | undefined
  ): Promise<APIMessage | undefined> {
    const embed = new MessageEmbed()
      .setTitle('Shard Ready')
      .setDescription(
        `${Formatters.bold('Shard ID')}: ${Formatters.inlineCode(id.toLocaleString())}`
      )
      .setColor('GREEN')
      .setTimestamp();

    if (unavailableGuilds && unavailableGuilds.size) {
      embed.addField(
        'Unavailable Guilds',
        [...unavailableGuilds.map((c) => c).entries()].join(', ')
      );
    }

    try {
      return await this.client.webhookLoggerClient.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
