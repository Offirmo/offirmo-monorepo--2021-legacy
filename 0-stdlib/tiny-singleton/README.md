
**This should be only useful for browsers!**

### Usage

Note: lazily created on 1st use, of course!

`"@offirmo-private/tiny-singleton": "^0"`
 	``
```typescript
// "@offirmo-private/tiny-singleton": "^0",
import tiny_singleton from '@offirmo-private/tiny-singleton'

interface DBClient {
	read: (id: number): Promise<void>
	write: (stuff: string): Promise<void>
}

function create_client(ip: string, logger: Console = console): DBClient {
	return ...
}

// use an intermediate function to typecheck the params
const get_client = tiny_singleton(() => create_client('127.0.0.1'))

get_client().read(1234).then(...)
get_client().write('hello').then(...)
```
