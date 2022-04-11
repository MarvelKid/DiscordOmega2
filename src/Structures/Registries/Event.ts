import type DiscordBot from '../DiscordBot';

interface EventOptions {
  readonly description?: string | undefined;
  readonly once?: boolean;
}

class Event {
  public readonly client: DiscordBot;
  public readonly name: string;
  public readonly description: string;
  public readonly type: 'once' | 'on';

  public constructor(client: DiscordBot, name: string, options: EventOptions) {
    /** @public */ this.client = client;
    /** @public */ this.name = name;
    /** @public */ this.description = options.description || 'No description.';
    /** @public */ this.type = options.once ? 'once' : 'on';
  }

  public run(..._args: any[]): void | any {
    throw new Error(`The run method has not been implemented in ${this.name}.`);
  }
}

export default Event;
