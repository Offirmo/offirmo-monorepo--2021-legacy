##

## Utilisation
```
omr⋄bg-image⁚parchment-xxl omr⋄filter⁚blurred⁚1
omr⋄bg-image⁚wood
omr⋄bg-image⁚stonewall
omr⋄bg-image⁚test
```

```
http://localhost:1981/9-oh-my-rpg/view-browser/doc/demo--index.html
http://localhost:1981/9-oh-my-rpg/view-browser/doc/demo--debug.html
http://localhost:1981/9-oh-my-rpg/view-browser/doc/demo--base.html
```
## Internals:

z-indexes:
- 0   : ground / ultimate background
- 100 : immersion view
  - 130 : universe anchor
  - x * 100 : upper worlds
  - 980 : chat TODO put in meta?
  - 990 : bottom menu TODO put in meta?
- 1000 : meta view
  - 1040 : logo
  - 1050 : hamburger

## Credits

Resources:
* Font: spectral https://spectral.prototypo.io/
* Font: Pix Antiqua - Public domain - https://www.dafont.com/pixantiqua.font
* Font https://managore.itch.io/m5x7
* Icons: https://game-icons.net/
* Image: img-parchment-xxl.jpg - MIT - https://github.com/stolksdorf/homebrewery
* Image: https://opengameart.org/content/rpg-gui-construction-kit-v10
* Misc: WoW - NOT FREE / TO REPLACE - https://github.com/Gethe/wow-ui-textures
* Font: https://www.behance.net/gallery/64168335/Keletifree-font-(download-link)
* colors: https://colorbrewer2.org/#type=qualitative&scheme=Set1&n=5

Inspiration:
* https://github.com/RonenNess/RPGUI
* https://tachyons.io/
* https://getflywheel.com/layout/css-svg-clipping-and-masking-techniques/

CSS tutorials:
* https://www.sitepoint.com/decorating-the-web-with-css-border-images/
* https://mehmetbat.com/blog/css3-filters/

Tools:
* https://icomoon.io/
* https://border-image.com/
* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Border-image_generator

Techniques
* https://medium.com/@peedutuisk/lesser-known-css-quirks-oddities-and-advanced-tips-css-is-awesome-8ee3d16295bb
* CSS variables
  * https://css-tricks.com/theming-with-variables-globals-and-locals/
  * https://simurai.com/blog/2018/04/01/contextual-styling
  * https://github.com/giuseppeg/suitcss-toolkit/tree/example-app/examples/app#themes
* https://youmightnotneedjs.com/

Similar
* https://bcrikko.github.io/NES.css/


## Roadmap

v1
- [x] build over an image background
- [ ] always display the game name
- [ ] responsive - desktop
-- [ ] responsive - mobile: portrait only
-- [ ] responsive - mobile: controls close to fingers
- [ ] nice
- [ ] display char name (if room)
- [ ] display some kind of status (if room)
- [ ] has quick access to usual sub-apps
- [ ] allow "annoucements"

vNext maybe
- [ ] level up interface
- [ ] modal capabilities
- [ ] has indirect access to any number of sub-apps, like a task switcher
- [ ] cue at shortcuts
- [ ] responsive - mobile: add landscape support
- [ ] settings interface
- [ ] low health / mana indicators
- [ ] swappable themes to cue of class/faction/ambiance
- [ ] display location


TODO glow effect ?
https://designshack.net/articles/css/12-fun-css-text-shadows-you-can-copy-and-paste/

https://nigelotoole.github.io/pixel-borders/
