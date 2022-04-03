## ...

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
