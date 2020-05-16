# stdarg

Parse and validate CLI arguments

## Usage

A basic command looks like this:

```js
// cmd.js

var Args = require('stdarg')
var number = require('stdopt/builtin/number')
var string = require('stdarg/string')

var command = new Args()
command.use(['port', 'p'], 'Server port', number)
command.use(['message', '-m'], 'Welcome message', string)
command.use(['log', 'l'], 'Toggle logging')

var argv = process.argv.slice(2)
var opts = command.parse(argv)
console.log('Parsed options: ' + JSON.stringify(opts))
console.log('Remaining argv: ' + argv.join(', '))
```

You can invoke it like so:

```
$ node cmd.js argument --message "Hello, world" some more
Parsed options: {"message": "Hello, world"}
Remaining argv: argument, some, more

$ node cmd.js --port 80 --log some more arguments
Parsed options: {"port": 80, "log": true}
Remaining argv: some, more, arguments

$ node cmd.js -lp 80 some more arguments
Parsed options: {"port": 80, "log": true}
Remaining argv: some, more, arguments

$ node cmd.js --port stuff
Error: stuff is an invalid value for --port

$ node cmd.js --message
Error: undefined is an invalid value for --message
```

### Help

You can also generate `help` output based on the configured options. Given the command above, you can add this as follows:

```js
args.use(['help', 'h'], 'Get help')

var argv = process argv.slice(2)
var opts = args.parse(argv)

if (opts.help) {
  args.help().forEach(line => console.log(line))
}
```

Invoking this gives the following output:

```
$ node cmd.js --help
--port, -p     Server port
--message, -m  Welcome message
--log, -l      Toggle logging
--help, -h     Get help
```

## License

Apache-2.0
