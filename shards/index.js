var stringSimilarity = require('string-similarity')
let fs = require('fs')
let path = require('path')
let shikiDbPath = path.join(__dirname, 'onmyojiShiki.json')
let shikiDb = JSON.parse(fs.readFileSync(shikiDbPath, 'utf8'))
let shardDbPath = path.join(__dirname, 'onmyojiShards.json')
let shardDb = JSON.parse(fs.readFileSync(shardDbPath, 'utf8'))


let shikiIndexArray = []
for(let ind in shikiDb){
  shikiIndexArray.push(ind)
}

module.exports = (args, message)=>{
    if(message.channel.name !== 'basebot') return
    const shardcommand = args.shift().toLowerCase();
    if("add".substring(0, shardcommand.length) === shardcommand){
      let shiki = args.join(' ')
      let bestMatch = stringSimilarity.findBestMatch(shiki, shikiIndexArray).bestMatch.target
      if(!shardDb[message.author.id]) shardDb[message.author.id] = {}
      if(!shardDb[message.author.id][bestMatch]) shardDb[message.author.id][bestMatch] = 0
      shardDb[message.author.id][bestMatch]++
      fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
      message.channel.send(message.author.username + ' now has ' + shardDb[message.author.id][bestMatch] + ' ' + bestMatch + ' shards.')
    }
    if("search".substring(0, shardcommand.length) === shardcommand){
      let shiki = args.join(' ')
      let bestMatch = stringSimilarity.findBestMatch(shiki, shikiIndexArray).bestMatch.target
      let results = {}
      for(let userId in shardDb){
        if(shardDb[userId][bestMatch]) results[userId] = shardDb[userId][bestMatch]
      }
      if(Object.keys(results).length === 0){
        message.channel.send('No shards found for ' + bestMatch)
        return
      }
      let responseString = 'The following users have ' + bestMatch + ' shards: \r\n'
      for(userId in results){
        responseString += '<@' + userId + '>: ' + results[userId] + '\r\n'
      }
      message.channel.send(responseString)
      return
    }
    if("set".substring(0, shardcommand.length) === shardcommand){
      let setnum = args.shift()
      let newCount = false
      try{
        newCount = parseInt(setnum)
      }catch(err){
      }
      if(newCount === false || isNaN(newCount)){
        message.channel.send('Invalid set count: ' + setnum)
        return
      }
      let shiki = args.join(' ')
      let bestMatch = stringSimilarity.findBestMatch(shiki, shikiIndexArray).bestMatch.target
      if(newCount <= 0){
        if(shardDb[message.author.id][bestMatch]) delete shardDb[message.author.id][bestMatch]
        if(Object.keys(shardDb[message.author.id]).length===0){
          delete shardDb[message.author.id]
          fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
          message.channel.send(message.author.username + ' is now out of all shards.')
          return
        }
        fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
        message.channel.send('Removed all ' + bestMatch + ' shards.')
        return
      }
      if(!shardDb[message.author.id]) shardDb[message.author.id] = {}
      shardDb[message.author.id][bestMatch] = newCount
      fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
      message.channel.send(message.author.username + ' now has ' + shardDb[message.author.id][bestMatch] + ' ' + bestMatch + ' shards.')
    }
    if("remove".substring(0, shardcommand.length) === shardcommand){
      let shiki = args.join(' ')
      let bestMatch = stringSimilarity.findBestMatch(shiki, shikiIndexArray).bestMatch.target
      if(!shardDb[message.author.id] || !shardDb[message.author.id][bestMatch]){
        message.channel.send(message.author.username + ' did not have any ' + bestMatch + ' shards.')
        return
      }
      shardDb[message.author.id][bestMatch]--
      if(shardDb[message.author.id][bestMatch] <= 0){
        delete shardDb[message.author.id][bestMatch]
        if(Object.keys(shardDb[message.author.id]).length===0){
          delete shardDb[message.author.id]
          fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
          message.channel.send(message.author.username + ' is now out of all shards.')
          return
        }
        fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
        message.channel.send(message.author.username + ' is now out of ' + bestMatch + ' shards.')
        return
      }
      fs.writeFileSync(shardDbPath, JSON.stringify(shardDb))
      message.channel.send(message.author.username + ' now has ' + shardDb[message.author.id][bestMatch] + ' ' + bestMatch + ' shards.')
      return
    }
    if("check".substring(0, shardcommand.length) === shardcommand){
      let userId = args.join(' ').replace('@','').replace('<','').replace('>','')
      if(!shardDb[userId]){
        message.channel.send('No shard data for ' + args.join(' '))
        return
      }
      let shardIndexArray = []
      for(let uind in shardDb){
        shardIndexArray.push(uind)
      }
      if(shardIndexArray.length === 0){
        message.channel.send('No current shard data.')
        return
      }
      let responseString = args.join(' ') + ' has the following shards:\r\n'
      for(let shiki in shardDb[userId]){
        responseString += '  ' + shiki + ': ' + shardDb[userId][shiki] + '\r\n'
      }
      message.channel.send(responseString)
    }
}