const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let axios = require('axios')
let bounty = require('./bounty')
let shards = require('./shards')

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`Haha!  Hoho!`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

let pinger = (message)=>{
  message.channel.send("Ping?").then(m=>{
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  });
}

let speaker = (args, message)=>{
  const sayMessage = args.join(" ");
  message.delete().catch(O_o=>{}); 
  message.channel.send(sayMessage);
}

let wikier = (args, message) => {
  const query = args.join("+");
  axios.get('https://en.wikipedia.org/w/api.php?action=opensearch&search='+query+'&limit=1&prop=extracts&format=json').then(res=>{
    if(res.data.length<3){
      message.channel.send('No data found on ' + res.data[0])
    }else{
      console.log('datatwo', res.data[2])
      if(res.data[2].toString()===''){
        message.channel.send('No extract for ' + res.data[1])
      }else{
        message.channel.send('**'+res.data[1]+'**\r\n\r\n'+res.data[2])
      }
    }
  }).catch(err=>{
    console.log('seracherr', err)
    message.channel.send('got nothin back')
  })
}

client.on("message", message => {
  try{
    //Ignore Bots
    if(message.author.bot) return;
    //Identify Prefix
    let prefixPresent = false
    for(let pind in config.prefix){
      let prefix = config.prefix[pind]
      if(message.content.indexOf(prefix) === 0) prefixPresent = prefix
    }
    if(prefixPresent === false) return
    //Parse Input
    const args = message.content.slice(prefixPresent.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if("ping".substring(0, command.length) === command) return pinger(message)
    if("say".substring(0, command.length) === command && message.author.username==='BaseDaruma') return speaker(args, message)

    //Verbose commands must be given in his special channel.
    if(message.channel.name !== 'basebot') return
    
    if("bounty".substring(0, command.length) === command) return bounty(command, args, message)
    if("wiki".substring(0, command.length) === command) return wikier(args, message)
    if("shards".substring(0, command.length) === command) return shards(args, message)
  }catch(err){
    console.error('message JERMM crash', err)
  }
});

client.login(config.token);