import type DiscordBot from '../Structures/DiscordBot';
import Event from '../Structures/Registries/Event';

export = class DebugEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'debug', {
      description: 'Emitted for general debugging information.',
    });
  }

  public run(info: string) {
    console.debug(info);
  }
};
