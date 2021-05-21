
## Contributing

### Concepts

#### No mixing of persisted data and logic data

- in general, PERSISTED data should really reflect what is in the persistence layer
- A conversion may be needed from persisted data to actual logic data,
  note the role of this lib
- Defaults may be provided, however the persisted data shouldn't store them,
  in order to preserve the fact that the data is missing in the first place.
  Also we could improve the infering logic.

= concept of CODE data and PERSISTED data
* PERSISTED data = reflects what is in the persistence layer (DB)
* CODE data = SANITIZED + DEFAULTED version of PERSISTENCE
* BASE data = shared base type used to build the types above
* SANITIZING = making user-entered data not harmful + normalized
               we redo it on un-persist because the sanitizing code may have improved!
* DEFAULTING = filling the holes with reasonable fallbacks (ex. gravatar)
               we redo it on un-persist because the defaults may have improved!

### naming convention

mention the table in function names?

### misc
* default the trx only when 1 db access (no transaction)


## References

* https://knexjs.org/
* https://github.com/Offirmo-team/wiki/wiki/PostgreSQL


## Tosort

postgres://someuser:somepassword@somehost:port/somedatabase

dev:
postgres://postgres:@127.0.0.1:32770/postgres


export UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL=\"silly\" \
