

1. sync
1. async
   1. next tick
   1. microtask
   1. setImmediate https://developer.mozilla.org/en-US/docs/Web/API/window/setImmediate https://github.com/YuzuJS/setImmediate
   1. set timeout 0
   1. requestAnimationFrame  ~1/60s
   1. set timeout n
   1. requestIdleCallback https://caniuse.com/requestidlecallback

Good articles:
* https://github.com/YuzuJS/setImmediate
* micro / macro tasks https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
* user-blocking / user-visible / background https://medium.com/airbnb-engineering/building-a-faster-web-experience-with-the-posttask-scheduler-276b83454e91

> A task is any JavaScript code which is scheduled to be run by the standard mechanisms
> such as initially starting to run a program, an event callback being run, or an interval or timeout being fired.
>These all get scheduled on the task queue.

> each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code.
> If not, it runs all of the microtasks in the microtask queue.
> The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.
> If a microtask adds more microtasks to the queue by calling queueMicrotask(),
> those newly-added microtasks execute before the next task is run.
> That's because the event loop will keep calling microtasks until there are none left in the queue, even if more keep getting added.

Note that Chrome timeouts are capped at >=1ms

TODO Cancellation tokens?
* https://devdocs.io/dom/idledeadline
* see an impl in typescript

TODO scheduler.postTask() ?
* https://blog.chromium.org/2021/08/chrome-94-beta-webcodecs-webgpu.html
* https://www.chromestatus.com/feature/6031161734201344


```
"@offirmo-private/async-utils": "^0",
```
```ts
import { asap_but_not_synchronous, dezalgo } from '@offirmo-private/async-utils'
import { asap_but_out_of_current_event_loop } from '@offirmo-private/async-utils'
import { asap_but_out_of_immediate_execution } from '@offirmo-private/async-utils'
import { schedule_when_idle_but_within_human_perception } from '@offirmo-private/async-utils'
import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import { elapsed_time_ms, end_of_current_event_loop, next_idle, all_planned_idle_executed } from '@offirmo-private/async-utils'

await end_of_current_event_loop()
```
