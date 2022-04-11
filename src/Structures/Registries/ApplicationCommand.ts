import type DiscordBot from '../DiscordBot';
import type {
  ApplicationCommandOptionData,
  CommandInteraction,
  PermissionString,
} from 'discord.js';

interface ApplicationCommandOptions {
  readonly aliases?: string[] | undefined;
  readonly description?: string | undefined;
  readonly usage?: string[] | string | undefined;
  readonly category?: string | undefined;
  readonly memberPermissions?: PermissionString[] | undefined;
  readonly botPermissions?: PermissionString[] | undefined;
  readonly guildOnly?: boolean | undefined;
  readonly ownerOnly?: boolean | undefined;
  readonly options?: ApplicationCommandOptionData[] | undefined;
  readonly cooldown?: number | undefined;
}

class ApplicationCommand {
  public readonly client: DiscordBot;
  public readonly name: string;
  public readonly description: string;
  public readonly usage: string | string[];
  public readonly category: string;
  public readonly memberPermissions: PermissionString[];
  public readonly botPermissions: PermissionString[];
  public readonly guildOnly: boolean;
  public readonly ownerOnly: boolean;
  public readonly options: ApplicationCommandOptionData[];
  public readonly cooldown: number;

  public constructor(client: DiscordBot, name: string, options: ApplicationCommandOptions) {
    /** @public */ this.client = client;
    /** @public */ this.name = name;
    /** @public */ this.description = options.description || 'No description.';
    /** @public */ this.options = options.options || [];
    /** @public */ this.usage = options.usage || 'No usage';
    /** @public */ this.category = options.category || 'Miscellaneous';
    /** @public */ this.memberPermissions = options.memberPermissions || [];
    /** @public */ this.botPermissions = options.botPermissions || this.client.defaultPermissions;
    /** @public */ this.guildOnly = options.guildOnly || false;
    /** @public */ this.ownerOnly = options.ownerOnly || false;
    /** @public */ this.cooldown = options.cooldown || this.client.defaultCooldown;
  }

  public async run(_interaction: CommandInteraction): Promise<void> {
    throw new Error(`The run method has not been implemented in ${this.name}.`);
  }
}

export default ApplicationCommand;
