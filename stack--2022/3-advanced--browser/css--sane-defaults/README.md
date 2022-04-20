
Base CSS improving the default browser stylesheet.

> sand down some of the rough edges in the CSS language. I do this with a functional set of custom baseline styles. https://www.joshwcomeau.com/css/custom-css-reset/

This is not a CSS framework:
- This thin layer of improvements should be usable on every website.
- No classes are declared

Can be used as a base for more advanced CSS frameworks

Features:
- by default, the minimal styles to make a page looks good (cf. "motherfucking website")
- by default, activates clever settings gleaned across blog posts (see list at bottom)

Inspiration:
* inspired by [motherfuckingwebsite](https://motherfuckingwebsite.com/) / [better](https://bettermotherfuckingwebsite.com/) / [perfect](https://perfectmotherfuckingwebsite.com/)
* inspired by techniques borrowed in articles around the net (see refs. in the code and "credits" below)


## Usage

### automatic (reset)
By default, this stylesheet will activate a page like "mother fucking website".
```html

	<link rel="stylesheet" type="text/css"
			href="https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--browser/ui--browser--css/dist/offirmo-reset%2Butils.css"/>
	<link rel="stylesheet" type="text/css"
			href="https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--browser/ui--browser--css/src/style--theme--dark--colorhunt212.css"/>
```
alternatively:
```css
@import 'https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--browser/ui--browser--css/dist/offirmo-reset%2Butils.css';
@import 'https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--browser/ui--browser--css/src/style--theme--dark--colorhunt212.css';

@import '../../../3-advanced--browser/ui--browser--css/src/style.css';
@import '../../../3-advanced--browser/ui--browser--css/src/style--theme--dark--colorhunt212.css';

```


## Credits
* https://motherfuckingwebsite.com/
* https://bettermotherfuckingwebsite.com/
* https://perfectmotherfuckingwebsite.com/
* https://www.leejamesrobinson.com/blog/how-stripe-designs-beautiful-websites/
* https://ianstormtaylor.com/design-tip-never-use-black/
* https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886
* https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96
* emoji icons https://preethisam.com/2018/06/25/how-to-use-emojis-as-icons/
* https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a
* nice hrs https://css-tricks.com/examples/hrs/
* https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
* nice buttons https://fdossena.com/?p=html5cool/buttons/i.frag


TODO evaluate https://hihayk.github.io/shaper/#system-ui,%20sans-serif/1.21/1.01/2.48/0.31/1.65/0.45/296/73/65/13/0.45/3/false
TODO https://glassmorphism.com/
TODO https://piccalil.li/quick-tips/
TODO https://uxdesign.cc/uniwidth-typefaces-for-interface-design-b6e8078dc0f7
TODO review units +
TODO review scalability
TODO review font size https://tonsky.me/blog/font-size/
TODO https://mxstbr.com/thoughts/margin/ https://www.madebymike.com.au/writing/css-architecture-for-modern-web-applications/
TODO https://tympanus.net/codrops/2021/10/25/the-process-of-building-a-css-framework/
