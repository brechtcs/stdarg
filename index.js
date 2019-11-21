module.exports = function (argv) {
  var arg, kv, short, prev
  var opts = { _: [] }
  var pointer = 2

  while (pointer < argv.length) {
    arg = argv[pointer]
    short = shorthand(arg)

    if (short.length) {
      for (arg of short) {
        opts[arg] = true
      }
      prev = short.slice(-1)
    } else if (arg.startsWith('--no-')) {
      opts[arg.replace('--no-', '')] = false
      prev = undefined
    } else if (arg.startsWith('--')) {
      kv = parse(arg.replace('--', ''))
      opts[kv.key] = kv.value
      prev = undefined
    } else if (prev) {
      opts[prev] = arg
      prev = undefined
    } else {
      opts._.push(arg)
    }
    pointer++
  }

  return opts
}

function parse (arg) {
  var parts = arg.split('=')
  var key = parts.shift()
  var value = parts.length ? parts.join('=') : true
  return { key, value }
}

function shorthand (arg) {
  if (arg.startsWith('-') && !arg.startsWith('--')) {
    return arg.slice(1)
  }
  return []
}
