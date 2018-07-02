[React Native Android Build Notes](https://facebook.github.io/react-native/docs/signed-apk-android.html)

Create key
``` keytool -genkey -v -keystore my-app-key.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000 ```

Add to gradle.properties
``` MYAPP_RELEASE_STORE_FILE=my-app-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=***** ```

Build in Android Studio
``` Build -> Generate Signed Apk ```

OR

Generate installable build
``` react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ ```

Generate build using gradle
``` cd android && ./gradlew assembleRelease ```

Upload to device
``` adb install -r ./app/build/outputs/apk/app-release-unsigned.apk ```
