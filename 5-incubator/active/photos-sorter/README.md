
## Credits
* https://github.com/photostructure/exiftool-vendored.js

## Contributing

### generic principles

* info should never be redundant, should have a single place
* execution should be stable on subsequent runs, i.e. we don't infer extra data from ourselves (would imply we enriched...)
* allow dry run
* sorted into <YYYY>/<YYYYMMDD - name>/<MMYYYYMMMD-...>

Date algorithm:
1. Manual, if present
1. EXIF if present
1. basename
1. FS but ONLY IF CONFIRMED by other hints

Date will always be improved by FS if the FS matches



### Phases
1. **exploration** the file system will be recursively explored at the given location
1. **consolidation** once all the files are explored, we can now consolidate the data,
	ex. merging notes and inferring folder types from their content
1. **de-duplication** files sharing the same hash will be assessed and only the best copy we'll be kept
1. **in-place normalization**
1. **sorting**
1. **cleanup**

### State & actions

State is immutable and represent the *actual* state of the file system (not future)
Obviously if the user somehow modify the fs while the program is running, could be out of sync
(race condition) hence we should not act on a state too old.

The state don't modify the fs, it enqueues a list of suggested actions.
Those actions, if processed, update back the state according to what they managed to do.

Actions are not guaranteed to be executed in order, hence should not have dependencies between themselves.
If needed, they should be scheduled in separate batches.

### Notes

Because we change the file system to sort photos (renaming and moving), we lose some original information.

To account for bugs or limitations, we decide to back up some "original data" about ALL the files.
This goes into "notes" files (for now only one at the root)

### misc

We don't move folders bc 1) conflicts are hard to solve 2) it would affect several files at once.
Instead, we move files independently to their ideal locations, ensuring the ideal folder exists.
At the end, we do a systematic sweep of all folders and clean the ones that turn out to be empty.

We don't even move and rename files in one pass, we do it in two passes for simplicity.

When renaming/moving a file, the underlying action will automatically add a duplication marker (x) in case of conflicts.

### TODO

- ~~infinite loop~~
- TODO unstable sorting -> normalizing more files on second run
- TODO non-renamed files being overly cleaned
- TODO badly sorted description.txt
- TODO lossless rotation + hashes chaining in notes
- TODO allow several event folders the same day, ex. morning and arvo
- TODO migration of notes
- TODO fs stats fixing
- TODO spread the notes across their folders
