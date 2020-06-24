Not a real package.

https://github.com/Offirmo-team/wiki/wiki/Apache-Cordova

```bash
cordova create client-cordova-gen
cd client-cordova-gen
FIX THE CONFIG HERE
cordova prepare

cordova platform add browser
cordova platform add ios
cordova platform add android
cordova requirements

open -a Xcode platforms/ios

cordova platform remove browser
cordova platform remove ios
cordova platform remove android

cordova platform update android

## https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/
cordova plugin add cordova-plugin-splashscreen

## https://appcenter.ms/
cordova plugin add cordova-plugin-appcenter-analytics
cordova plugin add cordova-plugin-appcenter-crashes

cordova plugin remove <plugin>
```
