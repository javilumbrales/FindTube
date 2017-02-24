  phonegap build android --release
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore findthetube.jks platforms/android/build/outputs/apk/android-release-unsigned.apk findthetube
  rm ~/aligned.apk
  ~/android-sdk/build-tools/25.0.1/zipalign  -p 4 platforms/android/build/outputs/apk/android-release-unsigned.apk  ~/aligned.apk
