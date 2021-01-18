
## Credits
* https://github.com/photostructure/exiftool-vendored.js

## Contributing

### State

State is immutable and represent the *actual* state of the file system (not future)
Obviously if the user somehow modify the fs while the program is running, could be out of sync.

The state don't modify the fs, it enqueues a list of suggested actions.
Those actions, if processed, update the state according to what they did.

Actions are not guaranteed to be executed in order, hence should not have dependencies between themselves.
If needed, execute them in separate batches.


### principles

dry run.

We don't move folders bc 1) conflicts are hard to solve 2) it would affect several files at once.
Instead, we move files independently to their ideal locations, ensuring the ideal folder exists.
At the end, we do a systematic sweep of all folders and clean the ones that turn out to be empty.

We don't even move and rename files in one pass, we do it in two passes for simplicity.

When renaming/moving a file, the underlying action will automatically add a duplication marker (x) in case of conflicts.

### TODO

- TODO lossless rotation + hashes chaining in notes
- TODO allow several event folders the same day, ex. morning and arvo
- TODO migration of notes
- TODO fs stats fixing
