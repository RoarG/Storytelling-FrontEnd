# Storytelling-FrontEnd


##Dependencies

* NodeJS (https://nodejs.org/download/)

### Android Spesific 
* Android SDK
* Keytool (JDK)
* jarsigner (JDK)
* zipalign (JDK)

### IOS Spesific 
* IOS xcode?

##Setup Guide

1. Install NodeJS NodeJS (https://nodejs.org/download/)

2. Install Ionic (http://ionicframework.com/getting-started/) 

  ```npm install -g cordova ionic```
  
3. Install Gulp

  ```npm install -g gulp```
  
3. Restore State (Install dependencies)

  ```ionic state restore```

  
## Testing 

Use these commands in the root folder of the project.

### Browser 

The app requiers internett access

* Both platform in one view

 ```ionic serve --lab```
 
* Singel

 ```ionic serve ```

### Android

 ```ionic run ```

Read more about ionic testing here: http://ionicframework.com/docs/guide/testing.html

### IOS




## Building
  
  (BLA BLA BLA)
  
### Android

1. Generate release build

  ```cordova build --release android ``` 

2. Generate key

  ```keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000 ``` 
  
3. Signing the APK

  ```jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk alias_name ``` 

3. Optimize the APK

  ```zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk```  

(These stepes are nessasary to update the application after you publised it the first time) 

Ps. Save the keystore file generated in step 2 for further patching.

### IOS
  



Read more about publishing ionic applications her: http://ionicframework.com/docs/guide/publishing.html
