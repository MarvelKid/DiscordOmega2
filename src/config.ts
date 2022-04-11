import type { PermissionString, Snowflake } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPrefix: process.env.DEFAULT_PREFIX,
  owners: process.env.BOT_OWNERS?.split(' ') as Snowflake[] | undefined,
  token: process.env.BOT_TOKEN,
  defaultPermissions: [
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'EMBED_LINKS',
    'READ_MESSAGE_HISTORY',
  ] as PermissionString[],
  clientId: process.env.CLIENT_ID as Snowflake | undefined,
  guildId: process.env.GUILD_ID as Snowflake | undefined,
  restType: (process.env.REST_TYPE || 'GUILD') as 'GLOBAL' | 'GUILD',
  defaultCooldown: parseInt(process.env.DEFAULT_COOLDOWN || '0'),
  mongoDB: process.env.MONGODB_URL,
  webhookURL: process.env.WEBHOOK_URL,
};
