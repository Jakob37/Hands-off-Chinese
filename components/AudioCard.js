import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import React from 'react';

import { default as Sound } from 'react-native-sound';

Sound.setCategory('Playback');

function playSound() {
  const appleSound = new Sound('ilikeapples_chinese.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    console.log('duration in seconds: ' + appleSound.getDuration() + 'number of channels: ' + appleSound.getNumberOfChannels());
  
    appleSound.play((success) => {
      if (success) {
        console.log('Successfully finished playing');
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    })
  })
}

function pressCall() {
    console.log('Press is called');
    playSound();
  }
  

const AudioCard = () => {
    return (
        <TouchableOpacity onPress={pressCall}>
            <Text>
                This is an audio card!
            </Text>
        </TouchableOpacity>
    );
}

export { AudioCard };