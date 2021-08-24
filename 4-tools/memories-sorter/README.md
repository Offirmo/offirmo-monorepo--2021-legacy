
## Credits
* https://github.com/photostructure/exiftool-vendored.js

## Contributing

### concepts
* exif = good but not 100% reliable
  * ex. low precision
  * ex. WhatsApp messing up
* timezones, ex. lunch time in another country should be 12h
* "primary infos" = directly read from the current file = name + exif + fs...
* fs has no timezone...
* folder date could be the event but also the backup date...
* TODO should we be afraid of hash collisions?

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
1. **FS exploration** the "root" folder is recursively explored
   1. all "memory" files have their "primary" infos read: hash, fs and exif (if any)
   2. all "notes" are migrated and merged into one big repo
2. **consolidation** once all the files are explored, we can now consolidate the data,
   ex. merging notes and inferring folder types from their content
3. **de-duplication** files sharing the same hash will be assessed and only the best copy we'll be kept
4. **in-place normalization**
5. **sorting**
6. **cleanup**

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

bugs
- ~~infinite loop~~

Features:
- TODO clarify unknown vs. undefined
- TODO unstable sorting -> normalizing more files on second run :/
- TODO folder unicode normalization
- TODO spread the notes across their folders
- TODO support numbered notes (for merging) and clean them?
- TODO hash collision detection (same ext & size)
- TODO folder dates are ~wrong -> use "better dates" instead?
- TODO non-renamed files being overly cleaned
- TODO badly sorted description.txt
- TODO lossless rotation + hashes chaining in notes
- TODO ~~allow several event folders the same day, ex. morning and arvo~~ too complicated, not worth it
- TODO ~~fs stats fixing~~ would complicate the algo too much, not worth it

For open sourcing:
- TODO optim
- TODO migration of notes

https://www.mtu.edu/umc/services/websites/writing/characters-avoid/
