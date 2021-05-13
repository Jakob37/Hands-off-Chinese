'use strict';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import React from 'react';
// import { default as RNFS } from 'react-native-fs';
// const RNFS = require('react-native-fs');
import RNFS from 'react-native-fs';
// console.log(RNFS.readDir);
console.log(RNFS.DownloadDirectoryPath);

RNFS.readDir(RNFS.DownloadDirectoryPath);

function loadFile(filePath) {
  console.log(`loading file from path: ${filePath}`);
}

const FileCard = ({filePath}) => {

    return (
        <TouchableOpacity 
        style={styles.container}
        onPress={() => loadFile('testpath')}>
            <Text>Click to load file</Text>
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
  

export { FileCard };