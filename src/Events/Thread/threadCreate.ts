import type DiscordBot from '../../Structures/DiscordBot';
import type { ThreadChannel } from 'discord.js';
import Event from '../../Structures/Registries/Event';

export = class ThreadCreateEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'threadCreate', {
      description:
        'Emitted whenever a thread is created or when the client user is added to a thread.',
    });
  }

  public async run(thread: ThreadChannel) {
    if (!thread.joinable) return;

    try {
      await thread.join();
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
