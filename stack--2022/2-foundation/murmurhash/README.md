## tiny Typescript wrapper around [murmurhash3js-revisited](https://github.com/cimi/murmurhash3js-revisited)

## Usage

### Node

```js
const create = require('@offirmo-private/murmurhash')
const { TextEncoder } = require('util')

let Murmur = create(TextEncoder)
const result = Murmur.v3.x64.hash_string_to_128(str)
                             hash_object_to_128(x)
```

### Browser

```js
import create from '@offirmo-private/murmurhash'

let Murmur = create(TextEncoder)
const result = Murmur.v3.x64.hash_string_to_128(str)
```

### Common

```js
import { setTextEncoder } from '@offirmo-private/murmurhash'

setTextEncoder(TextEncoder)
```
