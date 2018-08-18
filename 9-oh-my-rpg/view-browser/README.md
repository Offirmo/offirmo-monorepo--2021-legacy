##

## Utilisation
```
omr⋄bg-image⁚parchment-xxl omr⋄filter⁚blurred⁚1
omr⋄bg-image⁚wood
omr⋄bg-image⁚stonewall
omr⋄bg-image⁚test
```

## Internals:

z-indexes:
- 0    : ground / ultimate background
- 100 : immersion view
- 150 : immersion UI
- x * 100 : upper worlds
- 1000 : meta view

## Credits

Resources:
* Font: spectral
* Font: Pix Antiqua - Public domain - https://www.dafont.com/pixantiqua.font
* Font https://managore.itch.io/m5x7
* Icons: http://game-icons.net/
* Image: img-parchment-xxl.jpg - MIT - https://github.com/stolksdorf/homebrewery
* Image: https://opengameart.org/content/rpg-gui-construction-kit-v10
* Misc: WoW - NOT FREE / TO REPLACE - https://github.com/Gethe/wow-ui-textures
* Font: https://www.behance.net/gallery/64168335/Keletifree-font-(download-link)
* colors: http://colorbrewer2.org/#type=qualitative&scheme=Set1&n=5

Inspiration:
* https://github.com/RonenNess/RPGUI
* http://tachyons.io/
* https://getflywheel.com/layout/css-svg-clipping-and-masking-techniques/

CSS tutorials:
* https://www.sitepoint.com/decorating-the-web-with-css-border-images/
* http://mehmetbat.com/blog/css3-filters/

Tools:
* http://border-image.com/
* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Border-image_generator

Techniques
* https://medium.com/@peedutuisk/lesser-known-css-quirks-oddities-and-advanced-tips-css-is-awesome-8ee3d16295bb
* CSS variables
  * https://css-tricks.com/theming-with-variables-globals-and-locals/
  * http://simurai.com/blog/2018/04/01/contextual-styling
  * https://github.com/giuseppeg/suitcss-toolkit/tree/example-app/examples/app#themes
* http://youmightnotneedjs.com/



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
