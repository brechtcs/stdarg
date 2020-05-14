var { list, number } = require('stdopt')
var { Args, StringArgument } = require('./')
var test = require('tape')

test('basic', function (t) {
  var args = new Args()
  args.use(['port', 'p'], '...', number)
  args.use(['log', 'l'], '...')

  var argv = ['--port', '80', '-l']
  var opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, {
    log: true,
    port: 80
  })

  argv = ['some', '-p', '80', 'more', '--log', 'stuff']
  opts = args.parse(argv)
  t.deepEqual(argv, ['some', 'more', 'stuff'])
  t.deepEqual(opts, {
    log: true,
    port: 80
  })

  argv = ['--port=80', '5000']
  opts = args.parse(argv)
  t.deepEqual(argv, ['5000'])
  t.deepEqual(opts, {
    port: 80
  })

  argv = ['-lp', '80']
  opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, {
    log: true,
    port: 80
  })

  args.use(['numbers', 'number', 'n'], '...', list.of(number))
  argv = ['-n', '20', '--number', '36', '-n', '7']
  opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, {
    numbers: [20, 36, 7]
  })

  argv = ['--number', 'stuff']
  t.throws(() => args.parse(argv), /stuff is an invalid value for --number/)

  argv = ['--port', 'True']
  t.throws(() => args.parse(argv), /True is an invalid value for --port/)

  argv = ['-pl', '80']
  t.throws(() => args.parse(argv), /undefined is an invalid value for -p/)

  t.end()
})

test('strings', t => {
  var args = new Args()
  args.use(['message', 'm'], 'Message to display', StringArgument)

  var argv = ['dit', '--message', 'dat']
  var opts = args.parse(argv)
  t.deepEqual(argv, ['dit'])
  t.deepEqual(opts, { message: 'dat' })

  argv = ['--message=deze']
  opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, { message: 'deze' })

  argv = ['-azm', 'alles']
  opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, { message: 'alles' })

  argv = ['-mz', 'niks']
  t.throws(() => args.parse(argv), /undefined is an invalid value for -m/)

  argv = ['--message', '-xyz']
  t.throws(() => args.parse(argv), /-xyz is an invalid value for --message/)

  t.end()
})

test('help', t => {
  var args = new Args()
  args.use(['first', 'f'], 'First option')
  args.use(['second', 's'], 'Second option')
  args.use('third', 'Third option')
  args.use('4', 'Fourth option')

  t.deepEqual(args.help(), [
    '--first, -f \tFirst option',
    '--second, -s\tSecond option',
    '--third     \tThird option',
    '-4          \tFourth option'
  ])

  t.deepEqual(args.help({ spaces: 2 }), [
    '--first, -f   First option',
    '--second, -s  Second option',
    '--third       Third option',
    '-4            Fourth option'
  ])

  t.end()
})
