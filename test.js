var parse = require('./')
var test = require('tape')

test('shorthand', t => {
  var opts = parse([
    '/usr/bin/node',
    '/var/example.js',
    '-abc', 'nope',
    '-p', '8080'
  ])

  t.equal(opts.a, true)
  t.equal(opts.b, true)
  t.equal(opts.c, 'nope')
  t.equal(opts.p, '8080')
  t.end()
})

test('longhand', t => {
  var opts = parse([
    '/usr/bin/node',
    '/var/example.js',
    '--yep', '--some', 'stuff',
    '--no-stuff', 'nope'
  ])

  t.equal(opts.yep, true)
  t.equal(opts.stuff, false)
  t.equal(opts._.length, 2)
  t.ok(opts._.includes('stuff'))
  t.ok(opts._.includes('nope'))
  t.end()
})

test('key-value', t => {
  var opts = parse([
    '/usr/bin/node',
    '/var/example.js',
    '--some-other-flag',
    '--stuff=arf barf',
    'blah'
  ])

  t.equal(opts['some-other-flag'], true)
  t.equal(opts['stuff'], 'arf barf')
  t.equal(opts._.length, 1)
  t.ok(opts._.includes('blah'))
  t.end()
})
