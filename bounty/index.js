
var stringSimilarity = require('string-similarity')
let fs = require('fs')
let path = require('path')
let bountyDbPath = path.join(__dirname, 'onmyojiBounty.json')
let bountyDb = JSON.parse(fs.readFileSync(bountyDbPath, 'utf8'))
let sbountyDbPath = path.join(__dirname, 'onmyojiBounty-short.json')
let sbountyDb = JSON.parse(fs.readFileSync(sbountyDbPath, 'utf8'))
let sbountyIndexArray = []
for(let ind in sbountyDb){
  sbountyIndexArray.push(ind)
}
let bountyIndexArray = []
for(let ind in bountyDb){
  bountyIndexArray.push(ind)
}

module.exports = (command, args, message)=>{
    if("b".substring(0, command.length) === command){
      try{
        let shikiName = args.join(" ")
        let bestMatch = stringSimilarity.findBestMatch(shikiName, sbountyIndexArray).bestMatch.target
        let shiki = sbountyDb[bestMatch]
        message.channel.send('Bounty Info for: ' + shiki.name + '\r\n'+shiki.bountyInfo)
      }catch(err){
        console.error('b err', err)
      }
      return
    }
  
    if("bounty".substring(0, command.length) === command){
      try{
        let shikiName = args.join(" ")
        let bestMatch = stringSimilarity.findBestMatch(shikiName, bountyIndexArray).bestMatch.target
        let shiki = bountyDb[bestMatch]
        message.channel.send('Bounty Info for: ' + shiki.name + '\r\n'+shiki.bountyInfo)
      }catch(err){
        console.err('bounty err')
      }
      return
    }
}