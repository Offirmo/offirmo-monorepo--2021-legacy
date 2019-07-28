## 🧙The Boring RPG, reborn 👨🏻‍💻💰⚔🛡 - web version

Source code for the browser game "The Boring RPG, reborn"

The game is live here: https://www.online-adventur.es/apps/the-boring-rpg/

## Contributing

This app is hosted inside a bolt JavaScript mono-repo. Go clone it full.


## dev

```bash
ngrok http -subdomain=offirmo 8080
```


## Releasing

```bash
yarn build
(from the top)
bolt deploy
```


## TODO

```
npx bundle-inspector "https://www.online-adventur.es/apps/the-boring-rpg/index.html"
npx bundle-inspector "https://www.online-adventur.es/apps/the-boring-rpg-preprod/index.html"
```

## doc
* https://github.com/netlify/netlify-identity-widget
* https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0#babelpreset-stage-0
* https://github.com/igorprado/react-notification-system

## Credits
1. see package.json
2. art:
  * https://www.raphael-lacoste.com/projects
  * Dan Zhao
