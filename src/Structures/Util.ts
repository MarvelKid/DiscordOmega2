import type DiscordBot from './DiscordBot';
import type { PermissionString, Snowflake } from 'discord.js';
import { promisify } from 'util';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import path from 'path';
import Event from './Registries/Event';
import MessageCommand from './Registries/MessageCommand';
import ApplicationCommand from './Registries/ApplicationCommand';
import config from '../config';

const glob = promisify(require('glob'));

class Util {
  public constructor(private client: DiscordBot) {
    /** @private */ this.client = client;
  }

  public isClass(input: any): boolean {
    return (
      typeof input === 'function' &&
      typeof input.prototype === 'object' &&
      input.toString().substring(0, 5) === 'class'
    );
  }

  public get directory(): string | undefined {
    const main = require.main;

    if (!main) return;

    return `${path.dirname(main.filename)}${path.sep}`;
  }

  public checkOwner(target: Snowflake): boolean {
    return this.client.owners.includes(target);
  }

  public formatPermissions(permission: PermissionString): string {
    return permission
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
      .replace(/_/g, ' ')
      .replace(/Guild/g, 'Server')
      .replace(/Use Vad/g, 'Use Voice Acitvity');
  }

  public loadEvents(): any {
    return glob(`${this.directory}Events/**/*.js`).then((events: string[]) => {
      for (const eventFile of events) {
        delete require.cache[eventFile];

        const { name } = path.parse(eventFile);

        const File = require(eventFile);

        if (!this.isClass(File)) {
          throw new TypeError(`The event '${name}' doesn't export a class!`);
        }

        const event = new File(this.client, name);

        if (!(event instanceof Event)) {
          throw new TypeError(`The event '${name}' doesn't belong in Events!`);
        }

        this.client.events.set(event.name, event);

        this.client[event.type](name, (...args) => event.run(...args));
      }
    });
  }

  public loadMessageCommands(): any {
    return glob(`${this.directory}Commands/Message/**/*.js`).then((commands: string[]) => {
      for (const commandFile of commands) {
        delete require.cache[commandFile];

        const { name } = path.parse(commandFile);

        const File = require(commandFile);

        if (!this.isClass(File)) {
          throw new TypeError(`The event '${name}' doesn't export a class!`);
        }

        const command = new File(this.client, name);

        if (!(command instanceof MessageCommand)) {
          throw new TypeError(`The command '${name}' doesn't belong in MessageCommands!`);
        }

        this.client.commands.message.set(command.name.toLowerCase(), command);
      }
    });
  }

  public loadApplicationCommands(): any {
    return glob(`${this.directory}Commands/Interaction/**/*.js`).then(
      async (commands: string[]) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];

          const { name } = path.parse(commandFile);

          const File = require(commandFile);

          if (!this.isClass(File)) {
            throw new TypeError(`The event '${name}' doesn't export a class!`);
          }

          const command = new File(this.client, name);

          if (!(command instanceof ApplicationCommand)) {
            throw new TypeError(`The command '${name}' doesn't belong in ApplicationCommands!`);
          }

          const token = this.client.token;

          const clientId = config.clientId;

          if (!token || !clientId) {
            throw new Error(
              'One of the following are undefined: config.clientId or <Client>.token. Please make sure that they are all a typeof string and not undefined.'
            );
          }

          const rest = new REST({ version: '9' }).setToken(token);

          this.client.commands.application.set(command.name.toLowerCase(), command);

          if (config.restType && config.restType.toLowerCase() === 'guild' && config.guildId) {
            await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), {
              body: this.client.commands.application.map(({ ...data }) => data),
            });
          } else {
            await rest.put(Routes.applicationCommands(clientId), {
              body: this.client.commands.application.map(({ ...data }) => data),
            });
          }
        }
      }
    );
  }
}

export default Util;
