var { Opt, OptError, boolean } = require('stdopt')

class BooleanArgument extends Opt {
  static parse (b) {
    if (b === undefined) return true
    return boolean(b).catch(err => new BooleanError(err))
  }
}

class BooleanError extends OptError {}

module.exports.BooleanArgument = BooleanArgument
module.exports.BooleanError = BooleanError
