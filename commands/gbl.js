const Discord = require('discord.js')
const _ = require('lodash')

// Load the effects list
const effects = require('../settings/gbl')

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
		
		if (args.length === 1 && args[0] === 'info') {
			this.showChances(chan)
		}
		else {
			// Reconstruct the message
			let msg = args.join(' ')
			// Run through the effects list
			for (const fx of effects)
				msg = this.applyEffect(fx, msg, fx.initialChance)
			// Delete the original message
			message.delete()
			// Post the gabelized version along with a random intro
			chan.send(`${this.pickIntro(author)}\n${msg}`)
		}
	},
	
	// ----------------------------------------------------------------------------------------
	// Utils methods
	// ----------------------------------------------------------------------------------------
	pickIntro (author) {
		const lines = [
			`${author} *déraille ! Gaël, sors de ce corps !*`,
			`${author} *s'est fait piquer par l'araignée Gypsie !*`,
			`${author} *est sur le PC du boulot qui fait bugger Discord...*`,
		]
		return lines[_.random(lines.length - 1)]
	},
	splitInTwo (str, separator) {
		const words = str.split(separator)
		if (words.length < 2)
			return false
		
		const n = _.random(1, words.length - 1)
		let firstPart = _.take(words, n).join(separator)
		let secondPart = _.takeRight(words, words.length - n).join(separator)
		return [firstPart, secondPart]
	},
	applyEffect (fx, msg, chance, force) {
		force = typeof force != 'undefined' ? force : false
		// Roll the dice and return the unchanged message if fail
		if (!force &&_.random(1, 100) > chance)
			return msg
		// Apply the effect
		msg = this[fx.method].apply(this, [msg])
		// Retry with reduced chance
		return this.applyEffect(fx, msg, chance * fx.repeatModifier)
	},
	showChances (chan) {
		const msg = new Discord.MessageEmbed()
			.setTitle(`Liste des effets et chances d'application`)
		let desc, list = ``
		let ch
		for (const fx of effects) {
			desc = `*${fx.description_fr}*\n`
			if (fx.repeatModifier === 0)
				desc += `**Chance unique : **${fx.initialChance}%`
			else {
				desc += `**Chance de départ : **${fx.initialChance}% x ${fx.repeatModifier} à chaque passage\n`
				list = [fx.initialChance]
				ch = fx.initialChance
				while ((ch = ch * fx.repeatModifier) >= 1)
					list.push(_.floor(ch, 2))
				desc += `*(${list.join(', ')})*`
			}
			msg.addField(`\`${fx.method}\` :`, desc)
		}
		msg.setDescription(`Les effets sont appliqués dans l'ordre de la liste.`)
		chan.send(msg)
	},
	
	// ----------------------------------------------------------------------------------------
	// Effects methods
	// ----------------------------------------------------------------------------------------
	cutAndPaste (msg) {
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
	},
	lowercase (msg) {
		return _.toLower(msg)
	},
	randomUppercase (msg) {
		let words = msg.split(' ')
		const i = _.random(words.length - 1)
		words[i] = _.upperFirst(words[i])
		
		return words.join(' ')
	},
	moveSpace (msg) {
		let parts = this.splitInTwo(msg, ' ')
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
		
		return firstPart + ' ' + secondPart
	},
	doubleSpace (msg) {
		let words = msg.split(' ')
		const i = _.random(1,words.length - 1)
		words[i] = ' ' + words[i]
		
		return words.join(' ')
	},
	removePunctuation (msg) {
		let chars = ['.', ',']
		if (_.random(1) === 0)
			chars = _.reverse(chars)
		
		// Try finding first char
		let parts = this.splitInTwo(msg, chars.shift())
		if (!parts) {
			// Try finding other char
			parts = this.splitInTwo(msg, chars.shift())
			if (!parts)
				return msg
		}
		
		return parts[0] + parts[1]
	},
	removePair (msg) {
		let results = []
		const p = /ss|ll|mm|pp|nn|tt|rr|ff/gi
		while ((m = p.exec(msg)) != null) {
			results.push(m)
		}
		if (results.length === 0)
			return msg
		
		const n = _.random(0, results.length - 1)
		return msg.substr(0, results[n].index) + msg.substr(results[n].index + 1)
	},
	wrongPair (msg) {
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
		
		return firstPart + pair + secondPart
	},
	swapLetters (msg) {
		const index = _.random(0, msg.length - 2)
		
		let firstPart = msg.substr(0, index)
		let pair = msg.substr(index, 2)
		let secondPart = msg.substr(index + 2)
		pair = pair.split('').reverse().join('')
		
		return firstPart + pair + secondPart
	},
	removeRandomLetter (msg) {
		const index = _.random(0, msg.length - 1)
		
		let firstPart = msg.substr(0, index)
		let secondPart = msg.substr(index + 1)
		
		return firstPart + secondPart
	},
	replaceWord (msg) {
		// TODO
	},
	originStory (msg) {
		return `rl possibke, smsgb en chantant...) d'abord (suis sur`
	},
}

