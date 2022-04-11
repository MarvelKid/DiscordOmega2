import type DiscordBot from '../../Structures/DiscordBot';
import type { APIMessage } from 'discord-api-types/v9';
import { type CloseEvent, MessageEmbed, Formatters } from 'discord.js';
import Event from '../../Structures/Registries/Event';

export = class ShardDisconnectEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'shardDisconnect', {
      description: "Emitted when a shard's WebSocket disconnects and will no longer reconnect.",
    });
  }

  public async run(event: CloseEvent, id: number): Promise<APIMessage | undefined> {
    const embed = new MessageEmbed()
      .setTitle('Shard Disconnected')
      .setDescription(
        `${Formatters.bold('Shard ID')}: ${Formatters.inlineCode(id.toLocaleString())}`
      )
      .addField(
        'Close Event',
        `${Formatters.bold('Event Code')}: ${Formatters.inlineCode(
          event.code.toString()
        )}\n${Formatters.bold('Close Reason')}: ${event.reason}\n${Formatters.bold(
          'Event Cleanly Closed'
        )}: ${Formatters.italic(event.wasClean ? 'Yes' : 'No')}`,
        true
      )
      .setColor('DARK_RED')
      .setTimestamp();

    try {
      return await this.client.webhookLoggerClient.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
