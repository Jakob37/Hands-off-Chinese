'use strict';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    PermissionsAndroid,
} from 'react-native';
import React from 'react';
// import { default as RNFS } from 'react-native-fs';
// const RNFS = require('react-native-fs');
import RNFS, { readFileRes } from 'react-native-fs';
// console.log(RNFS.readDir);
// console.log(RNFS.DownloadDirectoryPath);

const requestWriteExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Writing permissions granted");
    } else {
      console.log("Writing permissions denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const requestReadExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Reading permissions granted");
    } else {
      console.log("Reading permissions denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

requestWriteExternalStoragePermission();
requestReadExternalStoragePermission();

console.log('New round');

// const dirContent = RNFS.readdir(RNFS.DownloadDirectoryPath);
// console.log(dirContent);

console.log(RNFS.DocumentDirectoryPath);

// console.log(ContentResolver.openInputStream);


RNFS.copyFileRes('ilikeapples_english.mp3', `${RNFS.DocumentDirectoryPath}/test.mp3`)
  .then((result) => {
    console.log(result);
  });

RNFS.readdir(RNFS.DocumentDirectoryPath)
  .then((result) => {
    console.log('Got result ', result.map((res) => res));
    // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  });


// RNFS.readFileRes('ilikeapples_english.mp3', 'UTF-8')
//   .then((result) => {
//     console.log(result);
//   });

//   .then((statResult) => {
//     if (statResult[0].isFile()) {
//       console.log('Found it!')
//     }
//   })

// RNFS.copyFileRes('ilikeapples_chinese.mp3', RNFS.DocumentDirectoryPath)
//   .then((result) => {
//     console.log(result);
//     return Promise.all([]);
//   })

// RNFS.readDir('./')
//   .then((result) => {
//     if (result) {
//       console.log('success');
//     } else {
//       console.log('fail');
//     }
//     // console.log('result');
//     // console.log('GOT RESULT', result.map((res) => res.name));
//     // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//   });

// RNFS.readDir(RNFS.DocumentDirectoryPath)
//   .then((result) => {
//     console.log('GOT RESULT', result.map((res) => res.name));
//     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//   });

// RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
//   .then((result) => {
//     console.log('GOT RESULT', result.map((res) => res.name));
//     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//   });

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