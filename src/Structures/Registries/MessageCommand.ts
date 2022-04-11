import type DiscordBot from '../DiscordBot';
import type { Message, PermissionString } from 'discord.js';

interface MessageCommandOptions {
  readonly aliases?: string[] | undefined;
  readonly description?: string | undefined;
  readonly usage?: string[] | string | undefined;
  readonly category?: string | undefined;
  readonly memberPermissions?: PermissionString[] | undefined;
  readonly botPermissions?: PermissionString[] | undefined;
  readonly guildOnly?: boolean | undefined;
  readonly ownerOnly?: boolean | undefined;
  readonly args?: boolean | undefined;
  readonly cooldown?: number;
}

class MessageCommand {
  public readonly client: DiscordBot;
  public readonly name: string;
  public readonly aliases: string[];
  public readonly description: string;
  public readonly usage: string | string[];
  public readonly category: string;
  public readonly memberPermissions: PermissionString[];
  public readonly botPermissions: PermissionString[];
  public readonly guildOnly: boolean;
  public readonly ownerOnly: boolean;
  public readonly args: boolean;
  public readonly cooldown: number;

  public constructor(client: DiscordBot, name: string, options: MessageCommandOptions) {
    /** @public */ this.client = client;
    /** @public */ this.name = name;
    /** @public */ this.aliases = options.aliases || [];
    /** @public */ this.description = options.description || 'No description.';
    /** @public */ this.usage = options.usage || 'No usage';
    /** @public */ this.category = options.category || 'Miscellaneous';
    /** @public */ this.memberPermissions = options.memberPermissions || [];
    /** @public */ this.botPermissions = options.botPermissions || this.client.defaultPermissions;
    /** @public */ this.guildOnly = options.guildOnly || false;
    /** @public */ this.ownerOnly = options.ownerOnly || false;
    /** @public */ this.args = options.args || false;
    /** @public */ this.cooldown = options.cooldown || this.client.defaultCooldown;
  }

  public async run(_message: Message, _args: string[]): Promise<Message<boolean> | undefined> {
    throw new Error(`The run method has not been implemented in ${this.name}.`);
  }
}

export default MessageCommand;
