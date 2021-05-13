'use strict';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import React from 'react';

import { AudioPaths } from './AudioPaths';

import { default as Sound } from 'react-native-sound';

Sound.setCategory('Playback');

function playSound(soundPath) {

    console.log(soundPath);
    const appleSound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error, 'from path', soundPath);
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

/**
 * @param {object} param
 * @param {string} param.audioPaths
 * @param {string} param.english
 * @param {string} param.chinese
 * @returns {View}
 */
const AudioCard = ({label, english, chinese}) => {

    return (
        <View>
            <Text>{label}</Text>
            <TouchableOpacity 
                style={styles.container}
                onPress={() => playSound(english)}>
                    <Text>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.container}
                onPress={() => playSound(chinese)}>
                    <Text>Chinese</Text>
            </TouchableOpacity>
        </View>
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