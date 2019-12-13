import { ParsedMessage } from 'discord-command-parser';
import { Message } from 'discord.js';
import { IBot, IBotPlugin, JackHandeyQuote } from '../resources';

const murphyHelpCommands = [
  {
    name: ".deep_thoughts",
    value: "Sends an extremely deep thought by Jack Handy."
  },
  {
    name: ".meme",
    value: "Sends a history meme. "
  },
  {
    name: ".jojo",
    value: "Sends a JoJo meme from r/shitpostcrusaders. "
  },
  {
    name: ".dank",
    value: "Sends a dank meme from r/dankmemes. "
  },
  {
    name: ".animeme",
    value: "Sends an animeme from r/animemes. "
  },
  {
    name: ".milestokm (number)",
    value: "Converts (number) miles to km. Can also be accessed by \"(number) miles to km. \""
  },
  {
    name: ".kmtomiles (number)",
    value: "Converts (number) km to miles. Can also be accessed by \"(number) km to miles. \""
  },
  {
    name: ".rogerhub (current_grade) (desired_grade) (final_exam_weight)",
    value: "Calculates what score you need on your final to raise it from your current grade to your desired grade. All units are in %."
  },
  {
    name: ".github",
    value: "Sends link to Mr. Murphy source code. "
  },
]

export default class MurphyPlugin implements IBotPlugin {
  preInitialize(bot: IBot): void {
    // Add help entries
    bot.helptext += "\n**Mr. Murphy Commands: **\n"
    for (let command of murphyHelpCommands) {
      console.log(command.name, command.value);
      bot.helptext += `\n\`${command.name}\` - ${command.value}\n`
    }

    // declare all the commands here
    // format is (nameOfCommand, (cmd: ParsedMessage, msg: Message) => {function})
    // Message is a discord.js Message.
    // ParsedMessage is a ParsedMessage from discord-command-parser module.
    // DO NOT INCLUDE A COMMAND PREFIX IN THE NAME OF THE COMMAND.
    // it will be added on later.
    bot.commands.on("deep_thoughts", (cmd: ParsedMessage, msg: Message) => {
      msg.channel.send('"' + JackHandeyQuote.getRandomQuote() + '" - Jack Handey');
    })
    .on("history_meme", (cmd: ParsedMessage, msg: Message) => {
      this.history_meme(msg, bot);
    })
    .on("meme", (cmd: ParsedMessage, msg: Message) => {
      this.history_meme(msg, bot);
    })
    .on("animeme", (cmd: ParsedMessage, msg: Message) => {
      this.animeme(msg, bot);
    })
    .on("jojo", (cmd: ParsedMessage, msg: Message) => {
      this.jojo(msg, bot);
    })
    .on("dank", (cmd: ParsedMessage, msg: Message) => {
      this.dank(msg, bot);
    })
    .on("milestokm", (cmd: ParsedMessage, msg: Message) => {
      this.milestokm(msg, bot);
    })
    .on("kmtomiles", (cmd: ParsedMessage, msg: Message) => {
      this.kmtomiles(msg, bot);
    })
    .on("rogerhub", (cmd: ParsedMessage, msg: Message) => {
      let current_grade = Number(cmd.arguments[0]);
      let desired_grade = Number(cmd.arguments[1]);
      let final_weight = Number(cmd.arguments[2])*0.01;
      msg.channel.send(`You need to score a ${(desired_grade - ((1-final_weight)*current_grade))/final_weight}% on the final!`);
    })
    .on("github", (cmd: ParsedMessage, msg: Message) => {
      msg.channel.send("https://github.com/bbworld1/Mr.-Murphy-II");
    });
  }

  postInitialize(bot: IBot): void {

  }

  // Functions for fetching memes
  // TODO: Move to separate module and/or clean up - doesn't fit in with rest of TypeScript syntax
  history_meme = async (message, bot) => {
  	const snekfetch = require('snekfetch');
    try {
      const { body } = await snekfetch
        .get('https://www.reddit.com/r/historymemes.json?sort=top&t=week')
        .query({ limit: 800 });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
      const randomnumber = Math.floor(Math.random() * allowed.length)
      message.channel.send(allowed[randomnumber].data.url)
    } catch (err) {
      return console.log(err);
    }
  }

  animeme = async (message, bot) => {
  	const snekfetch = require('snekfetch');
    try {
      const { body } = await snekfetch
        .get('https://www.reddit.com/r/animemes.json?sort=top&t=week')
        .query({ limit: 800 });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
      const randomnumber = Math.floor(Math.random() * allowed.length)
      message.channel.send(allowed[randomnumber].data.url)
    } catch (err) {
      return console.log(err);
    }
  }

  jojo = async (message, bot) => {
  	const snekfetch = require('snekfetch');
    try {
      const { body } = await snekfetch
        .get('https://www.reddit.com/r/shitpostcrusaders.json?sort=top&t=week')
        .query({ limit: 800 });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
      const randomnumber = Math.floor(Math.random() * allowed.length)
      message.channel.send(allowed[randomnumber].data.url)
    } catch (err) {
      return console.log(err);
    }
  }

  dank = async (message, bot) => {
  	const snekfetch = require('snekfetch');
    try {
      const { body } = await snekfetch
        .get('https://www.reddit.com/r/dankmemes.json?sort=top&t=week')
        .query({ limit: 800 });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
      const randomnumber = Math.floor(Math.random() * allowed.length)
      message.channel.send(allowed[randomnumber].data.url)
    } catch (err) {
      return console.log(err);
    }
  }

  kmtomiles = function(message, bot) {
  	let msg = message.content;
  	let msgArr = msg.split(" ");
  	let km = parseInt(msgArr[1]);
    if (Number.isNaN(km)) {
      message.channel.send(":x: Enter a number!");
    } else {
  	  message.channel.send(km/1.609 + " miles. ");
    }
  }

  milestokm = function(message, bot) {
  	let msg = message.content;
  	let msgArr = msg.split(" ");
  	let miles = parseInt(msgArr[1]);
    if (Number.isNaN(miles)) {
      message.channel.send(":x: Enter a number!");
    } else {
  	  message.channel.send(miles*1.609 + " km. ");
    }
  }
}
