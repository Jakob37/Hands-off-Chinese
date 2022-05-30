# Installation

## Setup

* Retrieve the 'custom-aws-exports.js' settings
* Setup the 'api' variables file

## Getting it running on Mac

Setup

* `git pull`
* `npm install`
* `pod install --verbose` <- Fixes linking of ios packages, verbose is good to see what it is doing if taking long time
* For audio to run in the background, the "handsoffchinese/Signing & Capabilities/Background Modes/Audio..." needs to be enabled

Outline

* You need a running emulator
* Start the local server (required?) `npm run start`
* Run the app (automatically starting emulator) `npm run ios`

Issues

* `Icon.loadFont()` needed when loading icons.
* Clearing previous builds needed when re-building app.
* See how to build directly to an iPhone device

