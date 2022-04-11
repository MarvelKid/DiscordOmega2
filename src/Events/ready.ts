import type DiscordBot from '../Structures/DiscordBot';
import Event from '../Structures/Registries/Event';
import chalk from 'chalk';
import mongoose from 'mongoose';

export = class ReadyEvent extends Event {
  private constructor(client: DiscordBot) {
    super(client, 'ready', {
      description: 'Emitted when the client becomes ready to start working.',
      once: true,
    });
  }

  public async run() {
    if (!this.client.isReady()) return;

    const mongoDBPing = await this.client.mongoDB.ping();

    console.log(chalk.blue(mongoose.connection.readyState));

    console.log(
      `Logged in as ${chalk.magenta(this.client.user.tag)}!\nMongoDB Ping: ${chalk.green(
        mongoDBPing.toFixed(1)
      )}ms.`
    );
  }
};
