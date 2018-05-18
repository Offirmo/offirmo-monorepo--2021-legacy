## @offirmo/view-css

A micro CSS framework (like Bootstrap but with minimal features)
with the minimal styles to make a page looks good.

Mostly for my personal use.

Can also be used as a base for more advanced CSS frameworks like @oh-my-rpg/view-browser

**[live demo on CodePen](https://codepen.io/Offirmo/pen/qYYWVy)**

* inspired by tachyons
* inspired by [motherfuckingwebsite](http://motherfuckingwebsite.com/) / [better](http://bettermotherfuckingwebsite.com/) / [perfect](http://perfectmotherfuckingwebsite.com/)
* inspired by techniques borrowed in articles around the net



## Usage

### automatic (reset)
TODO

### Manual
Activated through classes:

* Semantic classes (like`o⋄something`):
  * `o⋄top-container`
  * `o⋄centered-article`
  * `o⋄error-boundary-report`
* Technical classes (like`o⋄key⁚value`):
  * `o⋄font⁚fast-and-good-enough`
  * `o⋄font⁚system`
  * `o⋄font⁚roboto`
  * `o⋄font⁚roboto-condensed`
  * `o⋄color⁚secondary`  `o⋄color⁚ancillary`
  * `o⋄overflow-y⁚auto`
  * `o⋄text-align⁚center`
  * `o⋄text-noselect`
  * `o⋄pad⁚0`  `o⋄pad⁚5`  `o⋄pad⁚7`
  * `o⋄height⁚100pc`
  * `o⋄nav-list`
  * `o⋄flex-row`  `o⋄flex-column`
  * `o⋄flex-element-nogrow`
  * `o⋄flex-element-grow`
  * `o⋄checkbox-hacked` see https://css-tricks.com/the-checkbox-hack/
  
### Special techniques

**[More advanced demo](https://codepen.io/Offirmo/pen/zjavzJ)**

#### full height page working on mobile browser
You can't use height: 100vh on Chrome mobile or the url bar will get in the way. Solution:
```html
<html class="o⋄top-container">
	<body class="o⋄top-container">
		<div class="o⋄top-container o⋄centered-article o⋄pad⁚7">
			<p>Hello world</p>
```


## Credits
* http://motherfuckingwebsite.com/
* http://bettermotherfuckingwebsite.com/
* http://perfectmotherfuckingwebsite.com/
* https://www.leejamesrobinson.com/blog/how-stripe-designs-beautiful-websites/
* https://ianstormtaylor.com/design-tip-never-use-black/
* https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886
* https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96


## ideas TODO
Techniques
* http://simurai.com/blog/2018/04/01/contextual-styling
