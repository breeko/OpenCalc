Create key
``` keytool -genkey -v -keystore my-app-key.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000 ```

Generate installable build
``` react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ ```

Generate build using gradle
``` cd android && ./gradlew assembleRelease ```

Upload to device
``` adb install -r ./app/build/outputs/apk/app-release-unsigned.apk ```
