
export type TimestampUTCMs = number;

export function getUTCTimestampMs(now: Readonly<Date> = new Date()): TimestampUTCMs {
	return (+now)
}
