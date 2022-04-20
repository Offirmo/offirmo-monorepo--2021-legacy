
This tool sorts a directory of photo in-place:
- sort into a neat subdirectory structure
- cleans duplicates
- lossless: will keep a record of original file infos
- will preserve existing manual sorting (even just hints)
  - will do nothing if called again on a previously sorted dir
- will accurately date the photos according to a complex algorithm


## Credits
* https://github.com/photostructure/exiftool-vendored.js

## Contributing

### concepts
* "better date" is our own date representation (currently a wrapper around luxon)
  * this is the default type for dates, unless explicitly stated
* "processed" vs "non-processed". Files "processed" by this tool will be recognizable, notably by their specially crafted name
* "historical" vs "original" (aka. original non processed) we can never be sure that we have the original file. Hence "historical"
   = oldest known version, using hints such as: more recent file (FS) but with a non-processed name? then this name must be closer to the original.
* "primary" source = infos from the file itself and only it (+ maybe notes about a past version of it)
                     this is the preferred source for the date
* "secondary" source = info from outside the file, for ex. the parent folder name or the reliability of sibling files
                       this source "disappear" once the file is auto-sorted, hence we save it in "historical"
* "confidence" in date = either
  * primary    -> high confidence, we'll rename the file
  * secondary  -> lower confidence, we'll move the file but not rename it
  * junk       -> very low confidence, so low we don't even dare to move the file
  * even while being a primary info, FS date is not enough to reach "primary" unless confirmed by other sources
* "matching" dates are "matching" if they are equal:
  * strictly
  * or equal with different hours (tz) within 24h
  * or equal within precision ex.  12h37 "matches" 12h37:35_123
  * see `are_dates_matching_while_disregarding_tz_and_precision()`
* "fs reliability" = an estimation of the file system date reliability. Fs dates are unreliable,
                  but if we see all siblings having their FS date corroborated by EXIF or the parent folder name,
                  we may decide to trust the non-EXIF files as well
* "oldest known" vs. "original" We try to
* "junk" source = primary and secondary are not reliable, but we still provide a date (better than nothing)
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
2. EXIF if present
3. basename (if not canonical)
4. FS but ONLY IF CONFIRMED by other hints

Dates will always be improved by FS if the FS matches



### Phases
1. **FS exploration** the "root" folder is recursively explored
   1. all "memory" files have their "primary" infos read: hash, fs and exif (if any)
   2. all "notes" are migrated and merged into one big repo
2. **consolidation** once all the files are explored, we can now consolidate the data,
   ex. merging notes and inferring folder types from their content
   THIS PART IS TRICKY
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
