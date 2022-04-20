## CSS reset

Nothing to see here, one day I plan to make my own CSS reset.

In the meantime, it's just normalize.css + notes


## Introduction

### What is a CSS reset?

From Eric Meyer https://meyerweb.com/eric/tools/css/reset/
> The goal of a reset stylesheet is to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on.
> (...) Reset styles quite often appear in CSS frameworks...
>
> The reset styles (...) are intentionally very generic. There isn't any default color or background set for the body element, for example. (...)
>
> Goal: After including the appropriate stylesheet from this module,
> HTML pages using non-deprecated elements should look identical on every browser and form factor

My own reflexions on top of the above
* we not only want the same display across browsers and os, we also want stability across time = different versions of browser
* technically we should provide 1 reset per browser, maybe per combination browser+os

### Why a new one?

Reviewing the well known CSS, it appears they are not pure CSS reset:
* [normalize.css](https://github.com/necolas/normalize.css/)
  * removes all margins = bad display
  * still supports IE
* [Eric Meyer's](https://meyerweb.com/eric/tools/css/reset/)
  * not versioned/modularized (copy/paste on a web page)
  * not clearly commented (ex. mentions "older browsers")
  * goes beyond a reset by setting "recommended" styles
* [Josh Comeau's](https://www.joshwcomeau.com/css/custom-css-reset/)
  * not versioned/modularized (copy/paste on a blog post)
  * goes beyond a reset by "improving" styles
* [piccalilli](https://hankchizljaw.com/wrote/a-modern-css-reset/)
  * not versioned/modularized (copy/paste on a blog post)
  * goes beyond a reset with opiniated choices, ex. default list "style none"
* [a11y-css-reset](https://github.com/mike-engel/a11y-css-reset)
  * is not a reset, more like a "recommended"

What we want:
* ideally we want a pure reset bringing all browsers/os to the same common denominator
  WITHOUT introducing opinions or "recommended"
* this common denominator should display properly a semantic HTML (thus adding styles can be acceptable)
* deprecated elements and browsers/os should not longer be included
* should be unit tested with visual regression
* "sane defaults" should NOT be included, such recommended styles should be built upon the reset in a separated sheet


## Notes

Ideas
* TODO one day check if there is a standard default stylesheet https://stackoverflow.com/a/22510220/587407
* TODO one day check if one can use js to grab the default style from inside a browser
