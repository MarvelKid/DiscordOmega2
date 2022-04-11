import type { GuildSchema } from '../Database/Model/Schematics';
import type Event from './Registries/Event';
import type MessageCommand from './Registries/MessageCommand';
import type ApplicationCommand from './Registries/ApplicationCommand';
import type config from '../config';
import {
  type PermissionString,
  type Snowflake,
  Client,
  Intents,
  Collection,
  WebhookClient,
} from 'discord.js';
import { GuildModel } from '../Database/Model';
import Util from './Util';
import MongoDB from '../Database/MongoDB';

interface Bot {
  readonly defaultPrefix: string;
  readonly owners: string[];
  readonly defaultPermissions: PermissionString[];
  readonly utils: Util;
  readonly events: Collection<string, Event>;
  readonly commands: {
    readonly message: Collection<string, MessageCommand>;
    readonly application: Collection<string, ApplicationCommand>;
    readonly cooldowns: Collection<string, Collection<string, number>>;
  };
  readonly defaultCooldown: number;
  readonly mongoURL: string;
  readonly mongoDB: MongoDB;
  readonly webhookURL: string;
  readonly webhookLoggerClient: WebhookClient;
}

class DiscordBot extends Client implements Bot {
  public defaultPrefix: string;
  public owners: string[];
  public defaultPermissions: PermissionString[];
  public defaultCooldown: number;
  public mongoURL: string;
  public webhookURL: string;
  public readonly utils: Util;
  public readonly events: Collection<string, Event>;
  public readonly commands: {
    readonly message: Collection<string, MessageCommand>;
    readonly application: Collection<string, ApplicationCommand>;
    readonly cooldowns: Collection<string, Collection<string, number>>;
  };
  public readonly mongoDB: MongoDB;
  public readonly webhookLoggerClient: WebhookClient;

  public constructor(options: typeof config) {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      partials: ['MESSAGE'],
      presence: {
        activities: [
          {
            name: 'ts-template-v0.0.1#h712j8sb2a1',
            type: 'PLAYING',
          },
        ],
        status: 'online',
      },
      restWsBridgeTimeout: 60000,
      allowedMentions: {
        parse: ['users'],
      },
    });

    /** @private */ this.validate(options);

    /** @public */ this.utils = new Util(this);
    /** @public */ this.mongoDB = new MongoDB(this.mongoURL);

    /** @public */ this.events = new Collection<string, Event>();
    /** @public */ this.commands = {
      message: new Collection<string, MessageCommand>(),
      application: new Collection<string, ApplicationCommand>(),
      cooldowns: new Collection<string, Collection<string, number>>(),
    };

    /** @public */ this.webhookLoggerClient = new WebhookClient({ url: this.webhookURL });
  }

  private validate(options: typeof config): void {
    if (!options.defaultPrefix || typeof options.defaultPrefix !== 'string') {
      throw new TypeError(
        'The default prefix must be a typeof non-undefined string.\nCurrent Value: ' +
          options.defaultPrefix
      );
    }

    this.defaultPrefix = options.defaultPrefix;

    if (!options.owners || !Array.isArray(options.owners)) {
      throw new TypeError(
        'The owners has to be a typeof non-undefined Array<Snowflake>.\nCurrent Value: ' +
          options.owners
      );
    }

    this.owners = options.owners;

    if (!options.token || typeof options.token !== 'string') {
      throw new TypeError(
        'The bot token has to be a typeof non-undefined string.\nCurrent Value: ' + options.token
      );
    }

    this.token = options.token;

    if (!options.defaultPermissions || !Array.isArray(options.defaultPermissions)) {
      throw new TypeError(
        'The default permissions must be a typeof non-undefined Array<PermissionString>.\nCurrent Value: ' +
          options.defaultPermissions
      );
    }

    this.defaultPermissions = options.defaultPermissions;

    if (!options.clientId || typeof options.clientId !== 'string') {
      throw new TypeError(
        'The client Id must be a typeof non-undefined Snowflake.\nCurrent Value: ' +
          options.clientId
      );
    }

    if (!options.defaultCooldown || typeof options.defaultCooldown !== 'number') {
      throw new TypeError(
        'The default cooldown must be a typeof non-undefined number.\nCurrent Value: ' +
          options.defaultCooldown
      );
    }

    this.defaultCooldown = options.defaultCooldown;

    if (!options.mongoDB || typeof options.mongoDB !== 'string') {
      throw new TypeError(
        'The MongoDB database URL must be a typeof non-undefined string.\nCurrent Value: ' +
          options.mongoDB
      );
    }

    this.mongoURL = options.mongoDB;

    if (!options.webhookURL || typeof options.webhookURL !== 'string') {
      throw new TypeError(
        'The webhook logger URL must be a typeof non-undefined string.\nCurrent Value: ' +
          options.webhookURL
      );
    }

    this.webhookURL = options.webhookURL;
  }

  public async createGuild(id: Snowflake): Promise<GuildSchema> {
    const guild = await GuildModel.create({ guildId: id });

    return guild;
  }

  public async findOrCreateGuild(id: Snowflake): Promise<GuildSchema> {
    const guild = await GuildModel.findOne({ guildId: id });

    if (!guild) {
      return await this.createGuild(id);
    } else {
      return guild;
    }
  }

  public async start(
    token: string | undefined = this.token as string | undefined
  ): Promise<string> {
    this.utils.loadEvents();
    this.utils.loadMessageCommands();
    this.utils.loadApplicationCommands();

    this.mongoDB.init();

    return await super.login(token);
  }
}

export default DiscordBot;
