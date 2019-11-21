# stdarg

Zero-configuration CLI argument parser

## Usage

```js
var stdarg = require('stdarg')
var opts = stdarg(process.argv)

console.log(opts)

// $ node example.js -rn 5 --this="that" --force stuff
// => { _: ['stuff'], r: true, n: '5', this: 'that', force: true}
```

## Roadmap

These features are planned, but not supported yet:

- Mapping nested properties to nested objects, e.g. `cmd --nested.option="value"`
- Grouping recurring flags into array, e.g. `cmd --list="first" --list="second"`

## License

Apache-2.0
