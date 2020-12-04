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
		if (!os) {
			// Unique effects
			msg = cutAndPaste(msg, 20)
			msg = lowercase(msg, 80)
			// Repeatable effects
			msg = randomUppercase(msg, 40)
			msg = moveSpace(msg, 95)
			msg = doubleSpace(msg, 60)
			msg = removePunctuation(msg, 50)
			msg = removePair(msg, 60)
			msg = wrongPair(msg, 60)
			msg = switchLetters(msg, 40)
			msg = removeRandomLetter(msg, 40)
			// msg = replaceWord(msg, 75, true)
		}
		
		message.delete()
		chan.send(`${pickIntro(author)}\n${msg}`)
	},
}

function pickIntro (author) {
	const lines = [
		`${author} *est subitement habité par l'esprit du Gabel...*`,
		`${author} *s'est fait piquer par l'araignée Gypsie !*`,
	]
	return lines[_.random(lines.length - 1)]
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
function randomUppercase (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	const i = _.random(words.length - 1)
	words[i] = _.upperFirst(words[i])
	
	msg = words.join(' ')
	
	// Repeat chance
	return randomUppercase(msg, chance * 0.5)
}

// Move a space inside a adjacent word
function moveSpace (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let parts = _splitInTwo(msg, ' ')
	if (!parts)
		return msg
	
	let firstPart = parts[0]
	let secondPart = parts[1]
	
	if (_.random(1) === 0) {
		const fl = secondPart.slice(0, 1)
		firstPart += fl
		secondPart = secondPart.slice(1)
	}
	else {
		const ll = firstPart.slice(-1)
		firstPart = firstPart.slice(0, firstPart.length - 1)
		secondPart = ll + secondPart
	}
	
	msg = firstPart + ' ' + secondPart
	
	// Repeat chance
	return moveSpace(msg, chance * 0.8)
}

// Double a random space
function doubleSpace (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let words = msg.split(' ')
	const i = _.random(1,words.length - 1)
	words[i] = ' ' + words[i]
	
	msg = words.join(' ')
	
	// Repeat chance
	return doubleSpace(msg, chance * 0.75)
}

// Remove a . or ,
function removePunctuation (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let chars = ['.', ',']
	if (_.random(1) === 0)
		chars = _.reverse(chars)
	
	// Try finding first char
	let parts = _splitInTwo(msg, chars.shift())
	if (!parts) {
		// Try finding other char
		parts = _splitInTwo(msg, chars.shift())
		if (!parts)
			return msg
	}
	
	msg = parts[0] + parts[1]
	
	// Repeat chance
	return removePunctuation(msg, chance * 0.5)
}

// Remove a letter from a pair
function removePair (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let results = []
	const p = /ss|ll|mm|pp|nn|tt|rr|ff/gi
	while ((m = p.exec(msg)) != null) {
		results.push(m)
	}
	if (results.length === 0)
		return msg
	
	const n = _.random(0, results.length - 1)
	msg = msg.substr(0, results[n].index) + msg.substr(results[n].index + 1)
	
	// Repeat chance
	return removePair(msg, chance * 0.3)
}

// Mess up a pair of letters
function wrongPair (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	let results = []
	const p = /ss|ll|mm|pp|nn|tt|rr|ff/gi
	while ((m = p.exec(msg)) != null) {
		results.push(m)
	}
	if (results.length === 0)
		return msg
	
	const n = _.random(0, results.length - 1)
	let firstPart, pair, secondPart
	if (_.random(1) === 0) {
		firstPart = msg.substr(0, results[n].index - 1)
		pair = msg.substr(results[n].index - 1, 2)
		secondPart = msg.substr(results[n].index + 1)
	}
	else {
		firstPart = msg.substr(0, results[n].index + 1)
		pair = msg.substr(results[n].index + 1, 2)
		secondPart = msg.substr(results[n].index + 3)
	}
	pair = pair.split('').reverse().join('')
	
	msg = firstPart + pair + secondPart
	
	// Repeat chance
	return wrongPair(msg, chance * 0.3)
}

function switchLetters (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	const index = _.random(0, msg.length - 2)
	
	let firstPart = msg.substr(0, index)
	let pair = msg.substr(index, 2)
	let secondPart = msg.substr(index + 2)
	pair = pair.split('').reverse().join('')
	
	msg = firstPart + pair + secondPart
	
	// Repeat chance
	return switchLetters(msg, chance * 0.3)
}

function removeRandomLetter (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	const index = _.random(0, msg.length - 1)
	
	let firstPart = msg.substr(0, index)
	let secondPart = msg.substr(index + 1)
	
	msg = firstPart + secondPart
	
	// Repeat chance
	return removeRandomLetter(msg, chance * 0.3)
}

function replaceWord (msg, chance, force) {
	force = typeof force != 'undefined' ? force : false
	if (!force &&_.random(1, 100) > chance)
		return msg
	
	
	
	// Repeat chance
	return replaceWord(msg, chance * 0.75)
}

// UTILS

function _splitInTwo (str, separator) {
	const words = str.split(separator)
	if (words.length < 2)
		return false
	
	const n = _.random(1, words.length - 1)
	let firstPart = _.take(words, n).join(separator)
	let secondPart = _.takeRight(words, words.length - n).join(separator)
	return [firstPart, secondPart]
}







