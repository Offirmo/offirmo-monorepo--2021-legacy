
## Principles

Unless it's more convenient for some reasons, this repo strives to adhere to those principles:

* readability is the top desirable code property
  * TypeScript https://www.typescriptlang.org/
* problems broken down in manageable components = separation of concerns
* immutability if possible
* command / query separation
* compatible with event sourcing (for offline first with server replay when back online)
* mobile first
* offline first
* open source
  * give back with licenses such as UNLICENSE, CC prefered
  * open source whenever possible
* use boring technologies. Examples:
  * (if possible) node LTS over latest
  * (if possible) npm over yarn
  * as few tools as possible
  * Postgres
* dev should be possible locally
  * avoid using cloud only services
* avoid vendor lock-in
  * ex. auth, aws...
