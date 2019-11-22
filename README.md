# stdarg

Parse CLI arguments without configuration

## Usage

```js
var stdarg = require('stdarg')
var opts = stdarg(process.argv)

console.log(opts)

// $ node example.js -rn 5 --this="that" --force stuff
// => { _: ['stuff'], r: true, n: '5', this: 'that', force: true}
```

## Goals

This package aims to be a standardized, zero-configuration replacement for [`minimist`](https://github.com/substack/minimist). As such, the following features are planned, but not supported yet:

- Mapping nested properties to nested objects, e.g. `cmd --nested.option="value"`
- Grouping recurring flags into array, e.g. `cmd --list="first" --list="second"`

Some divergences from `minimist`'s default behaviour however are intentional. For example, `stdarg` makes no attempt to coerce strings to numbers. It is up to the program to decide when this is necessary and when it isn't. Also, arguments will always be evaluated as if using `minimist`'s [boolean option](https://github.com/substack/minimist#var-argv--parseargsargs-opts).

## License

Apache-2.0
