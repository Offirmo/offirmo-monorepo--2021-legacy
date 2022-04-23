Useful TypeScript utilities

```ts
import { Comparator, compare as _compare } from '@offirmo-private/ts-utils'

export { Comparator } // for convenience
export function compare(level_a: RelationshipLevel, comparator: Comparator, level_b: RelationshipLevel): boolean {
  return _compare<RelationshipLevel>(level_a, comparator, level_b, get_corresponding_index)
}
```
