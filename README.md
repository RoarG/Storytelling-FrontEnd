# Storytelling-FrontEnd


##Dependencies

* NodeJS (https://nodejs.org/download/)
* Gulp (https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

### Android Specific 
* Android SDK
* Keytool (JDK)
* jarsigner (JDK)
* zipalign (JDK)

### iOS Specific 
* iOS xcode?
* TODO add iOS dependencies

##Setup Guide

1. Install NodeJS (https://nodejs.org/download/)

2. Install Ionic (http://ionicframework.com/getting-started/) 

  ```npm install -g cordova ionic```
  
3. Install Gulp

  ```npm install -g gulp```
  
3. Restore State (Install dependencies)

  ```ionic state restore```

### Platform Dependencies

Android (the first section is necessary)
https://cordova.apache.org/docs/en/3.3.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide


iOS
https://cordova.apache.org/docs/en/3.3.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide

  
## Testing 

Use these commands in the root folder of the project to run the application.

### Browser 

The application requires internet access.

* Both platforms (Android and iOS) in one view

 ```ionic serve --lab```
 
* Single view which can be resized

 ```ionic serve```

### Android device

 ```ionic run android```

Read more about ionic testing here: http://ionicframework.com/docs/guide/testing.html

### iOS
TODO how to run on iOS device



## Building
  
### Android

1. Generate release build

  ```cordova build --release android ``` 

2. Generate key

  ```keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000 ``` 
  
3. Signing the APK

  ```jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk alias_name ``` 
  
    Where the AKP is located i.e. StoryTelling-Frontend\platforms\android\ant-build

3. Optimize the APK

  ```zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk```  

(These steps are necessary to update the application after you published it the first time) 

PS. Save the keystore file generated in step 2 for further patching.

### iOS
TODO how to build release on iOS



Read more about publishing Ionic applications here: http://ionicframework.com/docs/guide/publishing.html
