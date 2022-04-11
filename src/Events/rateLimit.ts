import type DiscordBot from '../Structures/DiscordBot';
import type { RateLimitData } from 'discord.js';
import Event from '../Structures/Registries/Event';

export = class RateLimitEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'rateLimit', {
      description: 'Emitted when the client hits a rate limit while making a request.',
    });
  }

  public run(RateLimitData: RateLimitData) {
    console.warn(JSON.stringify(RateLimitData));
  }
};
