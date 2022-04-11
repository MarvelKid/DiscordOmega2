import type DiscordBot from '../Structures/DiscordBot';
import type { InvalidRequestWarningData } from 'discord.js';
import Event from '../Structures/Registries/Event';

export = class InvalidRequestWarningEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'invalidRequestWarning', {
      description:
        'Emitted periodically when the process sends invalid requests to let users avoid the 10k invalid requests in 10 minutes threshold that causes a ban.',
    });
  }

  public run(invalidRequestWarningData: InvalidRequestWarningData) {
    console.debug(JSON.stringify(invalidRequestWarningData));
  }
};
