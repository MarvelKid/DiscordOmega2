# Discord Bot Template
A Discord bot template written in Typescript.

# Introduction
This template was made to give developers a starting point for new Discord bots. This template helps remove the focus on structuring the bot and setting it up in general, and that will allow the developers to focus on the meaningful bot features developers intend to create.

# Getting Started
Developers can simply copy this repository and follow the [setup instructions](https://github.com/Hauntmore/Discord-Bot-Template) below.

# Setup (Step-by-Step)
1. Enter your terminal and enter in the following command `git clone https://github.com/Hauntmore/Discord-Bot-Template.git`, make sure you have [git](https://git-scm.com) and [NodeJS](https://nodejs.org/en/) installed as well on your machine.
2. Enter into your cloned repository folder.
3. Create a bot and obtain its Discord Bot Token. You can do that by going to the [Discord Developer Portal](https://discord.com/developers/applications), and for a more detailed tutorial, refer to [this article](https://www.writebots.com/discord-bot-token/).
4. Locate the `.env.example` file and remove the `.example` extension.
5. Obtain the necessary keys and insert them into the newly `.env` file you have "edited" (Notes will be above each environment variable key). 
6. Navigate into your code editor's command prompt/go into your machine's command prompt and enter into the cloned repository. Then run the `npm install` command to install all the npm dependencies.
7. Once you have done steps 1-6, run the command `npm start` to launch your bot.
8. This is an optional step, if you would like to host your bot on pm2, head on over to the `ecosystem.config.js` file in the your project folder. Then change anything you would like, the basics are listed already.
9. To launch your bot on pm2, run the command `npm run start:pm2` after you've configured your pm2 configuration file.
10. Enjoy your bot! Feel free to add anything you would like to it.