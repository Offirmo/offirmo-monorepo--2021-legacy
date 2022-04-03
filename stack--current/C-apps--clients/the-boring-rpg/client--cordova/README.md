Not a real package.

https://github.com/Offirmo-team/wiki/wiki/Apache-Cordova

```bash
npm info cordova version && cordova -v

cordova create client--cordova--gen com.OffirmoOnlineAdventures.TheBoringRPG TheBoringRPG
cd client--cordova--gen
FIX THE CONFIG HERE
cordova prepare

cordova platform add browser
cordova platform add ios@^6
cordova platform add android
npm outdated
cordova requirements

open -a Xcode platforms/ios
cordova emulate ios
cordova run --list
cordova run --emulator --target iPhone-11-Pro

cordova platform remove browser
cordova platform remove ios
cordova platform remove android

cordova platform update android --save

## https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/
cordova plugin add cordova-plugin-splashscreen

## https://appcenter.ms/
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-appcenter-analytics
cordova plugin add cordova-plugin-appcenter-crashes

cordova plugin remove <plugin>
```

* TODO whitelist intent/navigation
* TODO detect cordova, correctly ga
* TODO UUID
* TODO find a way to update the code

TODO https://github.com/Panopath/cordova-app-updater
TODO https://github.com/Microsoft/cordova-plugin-code-push#readme
https://cordova.apache.org/howto/2020/07/18/uiwebview-warning.html
https://breautek.com/2020/07/14/enabling-cors/
