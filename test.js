var { list, number } = require('stdopt')
var Args = require('./arg')
var test = require('tape')

test('parse', function (t) {
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

  argv = ['-pl', '80']
  opts = args.parse(argv)
  t.deepEqual(argv, ['80'])
  t.deepEqual(opts, {
    log: true,
    port: true
  })

  args.use(['numbers', 'number', 'n'], '...', list.of(number))
  argv = ['-n', '20', '--number', '36', '-n', '7']
  opts = args.parse(argv)
  t.deepEqual(argv, [])
  t.deepEqual(opts, {
    numbers: [20, 36, 7]
  })

  t.end()
})
