var { Opt, string } = require('stdopt')

class StringArgument extends Opt {
  static parse (s) {
    return string(s).map(str => {
      if (!str.startsWith('-')) return str
    })
  }
}

module.exports.StringArgument = StringArgument
