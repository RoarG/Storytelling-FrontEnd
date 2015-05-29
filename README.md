# Storytelling-FrontEnd


##Dependencies

### Android Specific 
* Android SDK (See the Requirements and Support section at https://cordova.apache.org/docs/en/3.3.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)

To sign apk file:
* Keytool (JDK)
* jarsigner (JDK)
* zipalign (JDK)

### iOS Specific (only possible on Mac OSX)
* Xcode (install from the App Store)
	Minimum required version is Xcode 4.5. More on this at https://cordova.apache.org/docs/en/3.3.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide


##Setup Guide

1. Install NodeJS (https://nodejs.org/download/)

2. Install Cordova and Ionic (http://ionicframework.com/getting-started/) 

  ```npm install -g cordova ionic```
  
3. Install Gulp (https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

  ```npm install -g gulp```
  
3. Restore State (Install dependencies)

  ```ionic state restore```

  
## Testing 

Use these commands in the root folder of the project to run the application.

### Android

First run:

```ionic build android```

* Emulator

 ```ionic emulate android```

* Device

 ```ionic run android```

Read more about ionic testing here: http://ionicframework.com/docs/guide/testing.html

### iOS

First run:

```ionic build ios```

* Emulator

You need to run this to install the emulator: ```npm install -g ios-sim```

```ionic emulate ios```

* Device (requires Apple Developer account)

```ionic run ios```

* Ionic View app

You can install an app on iOS called Ionic view, and test "Vettu Hva?" through it. 
Requires an Ionic user. 

Run: 

```ionic upload```

You will then be asked to enter login information. 

Then it should be possible to download and run in Ionic View. If it for some reason should not appear, click on the eye icon at the top left and enter the ID from the command line. 

More information about Ionic View: http://blog.ionic.io/view-app-is-alive/

### Browser 

The application requires internet access.
Testing this way is not recommended. The app uses cordova plugins, and these will not work in the browser. 

* Both platforms (Android and iOS) in one view

 ```ionic serve --lab```
 
* Single view which can be resized

 ```ionic serve```


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

Read more about publishing Ionic applications on Android here: http://ionicframework.com/docs/guide/publishing.html

### iOS
Apple Developer account required. You can open the .xcodeproj project from the platforms/ios folder. 

You need to set up Xcode with your certificates: 
https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW6

How to distribute the app to test users:
https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html#//apple_ref/doc/uid/TP40012582-CH8-SW1
