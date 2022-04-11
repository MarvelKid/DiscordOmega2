module.exports = {
  apps: [
    {
      name: 'discord-bot',
      script: './dist/Bot.js',
      // Optional keys. (More information: https://pm2.keymetrics.io/docs/usage/application-declaration/)
      /* env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      }, */
    },
  ],
};
