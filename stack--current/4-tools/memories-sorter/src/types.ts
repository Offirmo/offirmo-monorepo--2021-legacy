
export type Basename = string
export type RelativePath = string // implied relative to "root"
export type AbsolutePath = string

export type SimpleYYYYMMDD = number
export type ISODateString = string

// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
export type TimeZone = string

export type UUID = string // TODO label each state with a UUID for logger to be able to attach errors/warnings
