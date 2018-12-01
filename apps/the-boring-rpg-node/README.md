The npm RPG ⚔🛡💰
===========

https://www.npmjs.com/package/the-npm-rpg

This is a simple command-line RPG. Every time you play, something happens!

**NOTE: still in Beta, savegame may be reset anytime**


## TLDR; I want to play !

(need node > 8) Just:
```bash
> npx  the-npm-rpg
```

### Full install
If you want to play faster:
```bash
> npm install --global  the-npm-rpg
> the-npm-rpg
```


## More info
Inspiration for the game itself was taken from the defunct "boring RPG" https://www.reddit.com/r/boringrpg/.

Inspiration to turn it into a command-line RPG was taken from the "npx" utility, recently integrated to npm. https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b

https://dev.to/nrobinson2000/why-you-need-terminal-bpd


## Troubleshooting
Please file a GitHub bug.

config path: `~/Library/Preferences/the-npm-rpg-nodejs/state.json`


### I can't get the latest version!
npx has a cache. To force a refresh:
`npx the-npm-rpg --ignore-existing`



## Contributing
TODO...

Hat tips:
* http://jlongster.com/Backend-Apps-with-Webpack--Part-I
* http://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
* https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
