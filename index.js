var { BooleanArgument, BooleanError } = require('./boolean')
var { StringArgument } = require('./string')
var { list, string } = require('stdopt')
var purge = require('purge')

class Args {
  constructor () {
    this.descriptions = new Map()
    this.patterns = new Map()
  }

  use (name, descr, type = BooleanArgument) {
    var aliases, description, key, alias, pattern, flag, short
    aliases = list(name, string).catch('Invalid `stdarg` argument name').value()
    description = string(descr).catch('Invalid `stdarg` argument description').value()
    this.descriptions.set(aliases, description)

    key = aliases[0]

    for (alias of aliases) {
      if (alias.length < 1) {
        continue
      } else if (alias.length === 1) {
        pattern = new RegExp(`^-(\\w+)?${alias}(\\w+)?$`)
        flag = '-' + alias
        short = true
      } else {
        pattern = new RegExp(`^--${alias}=?(.+)?$`)
        flag = '--' + alias
        short = false
      }

      this.patterns.set(pattern, { key, flag, short, type })
    }
  }

  parse (argv) {
    var used = []
    var res = {}
    var pattern, match

    argv.forEach((arg, i) => {
      for (pattern of this.patterns.keys()) {
        match = arg.match(pattern)
        if (match === null) continue

        var { key, flag, short, type } = this.patterns.get(pattern)
        var hoist = (short && !match[2]) || (!short && !match[1])
        var target = hoist ? argv[i + 1] : match[1]
        var value = new type(target).map(casted => {
          if (hoist) used.push(target)
          return casted
        }).catch(BooleanError, () => {
          return true
        }).catch(() => {
          return new Error(`${target} is an invalid value for ${flag}`)
        }).value()

        if (Array.isArray(res[key])) {
          res[key] = res[key].concat(value)
        } else {
          res[key] = value
        }

        used.push(arg)

        if (arg.startsWith('--')) {
          break
        }
      }
    })

    purge(argv, used)

    return res
  }

  help ({ spaces } = {}) {
    var sep = spaces ? ''.padEnd(spaces, ' ') : '\t'
    var opts = Array.from(this.descriptions.entries())
    var lines = opts.map(opt => {
      var descr = opt[1]
      var flags = opt[0].map(flag => {
        if (flag.length > 1) return '--' + flag
        else return '-' + flag
      }).join(', ')

      return { flags, descr }
    })

    var longest = lines.reduce((length, { flags }) => {
      return flags.length > length ? flags.length : length
    }, 0)

    return lines.map(({ flags, descr }) => {
      var col = flags.padEnd(longest, ' ')
      return col + sep + descr
    })
  }
}

module.exports = Args
module.exports.Args = Args
module.exports.BooleanArgument = BooleanArgument
module.exports.StringArgument = StringArgument
