## 🧙The Boring RPG, reborn 👨🏻‍💻💰⚔🛡 - web version

Source code for the browser game "The Boring RPG, reborn"

The game is live here: https://www.online-adventur.es/apps/the-boring-rpg/

## Contributing

This app is hosted inside a bolt JavaScript mono-repo. Go clone it full.


## dev

```bash
ngrok http -subdomain=offirmo 8080

yarn refresh-loading-template
yarn copy-extra--prod
```

```
localStorage.setItem('🛠UDA.override.logger.iframe-loading.logLevel', '"silly"')
localStorage.setItem('🛠UDA.override.should_trace_renders', true)
localStorage.setItem('🛠UDA.override.should_start_paused', true)
localStorage.setItem('🛠UDA.override.should_trace_ga', true)
```


## Releasing

```bash
yarn build
(from the top)
bolt deploy
```


## TODO

* TODO pulse relative to visibility API https://visibility-api.netlify.app

```
duplicated packages
yarn global add bundle-inspector
npx bundle-inspector "http://localhost:1981/C-apps--clients/the-boring-rpg/client--browser/dist/index-2.html"
npx bundle-inspector "https://www.online-adventur.es/apps/the-boring-rpg-preprod/index-2.html"
npx bundle-inspector "https://www.online-adventur.es/apps/the-boring-rpg/index-2.html"

parcel-plugin-bundle-visualiser (uncomment it)
window.TREE_DATA.groups = window.TREE_DATA.groups.slice(1,2)

source-map-explorer ./dist/index-2.51e35431.js ./dist/index-2.51e35431.js.map
```

## doc
* https://github.com/netlify/netlify-identity-widget
* https://github.com/igorprado/react-notification-system

## Credits
1. see package.json
2. art:
  * https://www.raphael-lacoste.com/projects
  * Dan Zhao
