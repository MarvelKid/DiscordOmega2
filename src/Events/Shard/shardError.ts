import type DiscordBot from '../../Structures/DiscordBot';
import type { APIMessage } from 'discord-api-types/v9';
import { MessageEmbed, Formatters, MessageButton, MessageActionRow } from 'discord.js';
import Event from '../../Structures/Registries/Event';
import sourcebin from 'sourcebin';

export = class ShardErrorEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'shardError', {
      description: "Emitted whenever a shard's WebSocket encounters a connection error.",
    });
  }

  public async run(error: Error, shardId: number): Promise<APIMessage | undefined> {
    const binStack = await sourcebin.create(
      [
        {
          content: error.stack || error.message,
          language: 'typescript',
        },
      ],
      { title: 'Shard Error', description: 'Error Stack Message.' }
    );

    const binError = await sourcebin.create(
      [
        {
          content: error.toString(),
          language: 'typescript',
        },
      ],
      { title: 'Full Shard Error', description: 'Full Error.' }
    );

    const binStackButton = new MessageButton()
      .setLabel('Error Stack')
      .setURL(binStack.url)
      .setStyle('LINK');

    const binErrorButton = new MessageButton()
      .setLabel('Error Object')
      .setURL(binError.url)
      .setStyle('LINK');

    const row = new MessageActionRow().addComponents(binStackButton, binErrorButton);

    const embed = new MessageEmbed()
      .setTitle('Shard Error')
      .setDescription(
        `${Formatters.bold('Shard ID')}: ${Formatters.inlineCode(shardId.toLocaleString())}`
      )
      .setColor('RED')
      .setTimestamp();

    try {
      return await this.client.webhookLoggerClient.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
