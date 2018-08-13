## @offirmo/view-css

A micro CSS framework (like Bootstrap but with minimal features)
with the minimal styles to make a page looks good.

Mostly for my personal use.

Can also be used as a base for more advanced CSS frameworks like @oh-my-rpg/view-browser

**[live demo on CodePen](https://codepen.io/Offirmo/pen/qYYWVy)** (Thanks [rawgit](https://rawgit.com/))

* inspired by [tachyons](https://tachyons.io/)
* inspired by [motherfuckingwebsite](http://motherfuckingwebsite.com/) / [better](http://bettermotherfuckingwebsite.com/) / [perfect](http://perfectmotherfuckingwebsite.com/)
* inspired by techniques borrowed in articles around the net:
  * using data="xyz" http://simurai.com/blog/2018/04/01/contextual-styling
    * (more about data) https://www.sitepoint.com/use-html5-data-attributes/


## Usage

### automatic (reset)
TODO

### Manual
Activated through classes:

* Semantic classes (like`o⋄something`):
  * `o⋄top-container`
  * `o⋄centered-article`
  * `o⋄error-report`
  * `o⋄text-noselect`
  * `o⋄nav-list`
  
* Technical classes (like`o⋄key⁚value`):
  * `o⋄font⁚fast-and-good-enough`
  * `o⋄font⁚system`
  * `o⋄font⁚roboto`
  * `o⋄font⁚roboto-condensed`
  
  * `o⋄color⁚main`
  * `o⋄color⁚secondary`
  * `o⋄color⁚ancillary`
  
  * `o⋄pad⁚0`
  * `o⋄pad⁚5`
  * `o⋄pad⁚7`
  
  * `o⋄flex--row`
  * `o⋄flex--column`
  * `o⋄flex--centered-content`
  * `o⋄flex-element--nogrow`
  * `o⋄flex-element--grow`
  
  * `o⋄text-align⁚center`
  * `o⋄overflow-y⁚auto`
  * `o⋄height⁚100pc`
  
  * `.o⋄border⁚default`
  
* data selectors
  * `data-o⋄theme="light-on-dark"` (dark-on-light being the default)


### Special techniques

**[More advanced demo](https://codepen.io/Offirmo/pen/zjavzJ)**

#### full height page working on mobile browser
You can't use height: 100vh on Chrome mobile or the url bar will get in the way. Solution:
```html
<html>
	<body>
		<div class="o⋄top-container o⋄centered-article o⋄pad⁚7">
			<p>Hello world</p>
```

#### containers debug
```html
	<style type="text/css">
		.o⋄top-container {
			border-width: 1px;
		}
	</style>
</head>

<html class="o⋄top-container">
	<body class="o⋄top-container">
		<div class="o⋄top-container o⋄centered-article">
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
* currentColor https://css-tricks.com/currentcolor/
* emoji icons https://preethisam.com/2018/06/25/how-to-use-emojis-as-icons/
