'use strict';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import React from 'react';

import { default as Sound } from 'react-native-sound';

Sound.setCategory('Playback');

function playSound(soundPath) {
    const appleSound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  
    appleSound.play((success) => {
      if (success) {
        console.log('Successfully finished playing');
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    })
  })
}

function pressCall(arg) {
    console.log('Press is called');
    playSound(arg);
}
  

const AudioCard = ({audioPath}) => {

    return (
        <TouchableOpacity 
        style={styles.container}
        onPress={() => pressCall(audioPath)}>
            <Text>
                This is an audio card!
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 16,
      paddingHorizontal: 24,
    },
    linkContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    link: {
      flex: 2,
      fontSize: 18,
      fontWeight: '400',
      color: 'black',
    },
    description: {
      flex: 3,
      paddingVertical: 16,
      fontWeight: '400',
      fontSize: 18,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
    },
  });
  

export { AudioCard };