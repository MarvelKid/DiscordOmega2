import { Formatters } from 'discord.js';
import DiscordBot from './Structures/DiscordBot';
import config from './config';

const Client = new DiscordBot(config);

process.on('unhandledRejection', async (reason, promise) => {
  console.log('Reason:', reason, '\n', 'Promise:', promise);

  await Client.webhookLoggerClient.send({
    content:
      'Reason: ' +
      Formatters.codeBlock('ts', reason as string) +
      '\n' +
      'Promise: ' +
      Formatters.codeBlock('ts', promise.toString()),
  });
});

process.on('uncaughtException', async (error, origin) => {
  console.log('Error:', error, '\n', 'Origin:', origin);

  await Client.webhookLoggerClient.send({
    content:
      'Error: ' +
      Formatters.codeBlock('ts', error.toString()) +
      '\n' +
      'Origin: ' +
      Formatters.codeBlock('ts', origin.toString()),
  });
});

const login = async () => {
  try {
    await Client.start(config.token);
  } catch (error) {
    console.error(error);
    return;
  }
};

void login();

export { Client };
