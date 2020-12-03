const _ = require('lodash')

module.exports = {
	name: 'gbl',
	guildOnly: true,
	adminOnly: false,
	description: 'Gabelise votre message',
	usage: 'Votre message',
	args: true,
	execute(message, args, client) {
		const chan = message.channel
		const author = message.author
		let msg = args.join(' ')
		
		// Special effect
		const os = originStory(msg, 1)
		msg = !os ? msg : os
		// If not applied
		if (!os)
		{
			// Unique effects
			msg = cutAndPaste(msg, 20)
			msg = lowercase(msg, 80)
			// Repeatable effects
			msg = randomUppercase(msg, 40)
			msg = doubleSpace(msg, 60, true)
		}
		
		
		
		message.delete()
		chan.send(`${author} *est subitement habité par l'esprit du Gabel et dit :*\n${msg}`)
	},
}

// Send the original Gabel message
function originStory (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return false
	
	return `rl possibke, smsgb en chantant...) d'abord (suis sur`
}

// Take 2 or 3 consecutive words and move them to the end of the message
function cutAndPaste (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force && _.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	if (words.length < 5)
		return msg
	
	let wordCount = _.random(2, 3)
	let startIndex = _.random(words.length - wordCount - 1)
	let indexes = []
	for (i = startIndex; i < startIndex + wordCount; i++)
		indexes.push(i)
	let pulled = _.pullAt(words, indexes)
	return _.concat(words, pulled).join(' ')
}

// Lowercase the whole message
function lowercase (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	return _.toLower(msg)
}

// Uppercase the first letter of a random word
function randomUppercase (msg, chance, force, iter) {
	force = typeof force != 'undefined' ? force : false
	iter = typeof iter != 'undefined' ? iter : 0
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	const i = _.random(words.length - 1)
	words[i] = _.upperFirst(words[i])
	
	msg = words.join(' ')
	iter++
	
	// Repeat chance if < max repeat
	chance *= 0.5
	if (iter < 3)
		return randomUppercase(msg, chance, false, iter)
	else
		return msg
}

// Double a random space
function doubleSpace (msg, chance, force, iter) {
	force = typeof force != 'undefined' ? force : false
	iter = typeof iter != 'undefined' ? iter : 0
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	const i = _.random(1,words.length - 1)
	words[i] = ' ' + words[i]
	
	msg = words.join(' ')
	iter++
	
	// Repeat chance if < max repeat
	chance *= 0.75
	if (iter < 4)
		return doubleSpace(msg, chance, false, iter)
	else
		return msg
}

// Move a space inside a adjacent word
function moveSpace (msg, chance, force, iter) {
	force = typeof force != 'undefined' ? force : false
	iter = typeof iter != 'undefined' ? iter : 0
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	const i = _.random(1,words.length - 1)
	words[i] = ' ' + words[i]
	
	msg = words.join(' ')
	iter++
	
	// Repeat chance if < max repeat
	chance *= 0.65
	if (iter < 3)
		return moveSpace(msg, chance, false, iter)
	else
		return msg
}










