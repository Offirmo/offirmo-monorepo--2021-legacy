
Energy bar, like most mobile games.

Support an onboarding period where energy comes back faster.

Interesting reads:
* https://dota2.gamepedia.com/Cooldown

## contributing

This lib uses fractions for maintaining accuracy over repeated short time increases (elapsed).

the smallest time unit is ms. Durations should thus NOT be expressed in fractions, but in ms.

The state is separated in
- UState = user-dependent state = only changes following a user action
- Tstate = same + time dependent state, changes according to the current time (included in the state)
