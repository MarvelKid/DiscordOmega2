import type DiscordBot from '../Structures/DiscordBot';
import Event from '../Structures/Registries/Event';

export = class WarnEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'warn', {
      description: 'Emitted for general warnings.',
    });
  }

  public run(info: string) {
    console.debug(info);
  }
};
