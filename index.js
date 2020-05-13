var { boolean, list, string } = require('stdopt')
var purge = require('purge')

class Args {
  constructor () {
    this.descriptions = new Map()
    this.patterns = new Map()
  }

  use (name, descr, type = boolean) {
    var aliases, description, key, alias, pattern, short
    aliases = list(name, string).catch('Invalid `stdarg` argument name').value()
    description = string(descr).catch('Invalid `stdarg` argument description').value()
    this.descriptions.set(aliases, description)

    key = aliases[0]

    for (alias of aliases) {
      if (alias.length < 1) {
        continue
      } else if (alias.length === 1) {
        pattern = new RegExp(`^-(\\w+)?${alias}(\\w+)?$`)
        short = true
      } else {
        pattern = new RegExp(`^--${alias}=?(.+)?$`)
        short = false
      }

      this.patterns.set(pattern, { key, short, type })
    }
  }

  parse (argv) {
    var hoisted, res, pattern, match
    hoisted = []
    res = {}

    argv.forEach((arg, i) => {
      for (pattern of this.patterns.keys()) {
        match = arg.match(pattern)
        if (match === null) continue

        var { key, short, type } = this.patterns.get(pattern)
        var hoist = (short && !match[2]) || (!short && !match[1])
        var target = hoist ? argv[i + 1] : match[1]

        var parsed = type(target)
          .map(value => {
            if (hoist) hoisted.push(target)
            return value
          })
          .or(boolean, true)
          .value()

        if (Array.isArray(res[key])) {
          res[key] = res[key].concat(parsed)
        } else {
          res[key] = parsed
        }

        if (arg.startsWith('--')) {
          break
        }
      }
    })

    purge(argv, arg => {
      return arg.startsWith('-') || hoisted.includes(arg)
    })

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
