import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { AudioPlayer, playSound, testLoad } from "./AudioPlayer";
import { styles } from "./Stylesheet";

let keepGoing = false;


async function startPlaying() {


    if (audioPlayer != null) {

        keepGoing = true;

        const numberClips = audioPlayer.getNumberClips();

        const playOne = () => {
            if (keepGoing) {
                audioPlayer.playIndex(0, playOne);
            } else {
                console.log('keepGoing is false, stopping!');
            }
        };

        playOne();

        // audioPlayer.playPath('ilikeapples_chinese.mp3', () => {
        //     if ()
        // })

        // let delayUntilNext = 0;
        // for (let i = 0; i < numberClips; i++) {


        //     console.log('Playing clip', i);
        //     // await setTimeout(
        //     //     () => {
        //     //         delayUntilNext = audioPlayer.playIndex(i);
        //     //     }, 
        //     //     delayUntilNext
        //     // );
        // }

        // const duration = audioPlayer.playIndex(0);
        // console.log('Playing for duration:', duration);
        // setTimeout(() => { audioPlayer.playIndex(1)}, duration);
    } else {
        console.log('No audio player loaded!');
    }
}

let chineseAudio = null;
let englishAudio = null;
let audioPlayer = null;


function load() {
    chineseAudio = testLoad('ilikeapples_chinese.mp3');
    englishAudio = testLoad('ilikeapples_english.mp3');
    const audioPaths = [
        'ilikeapples_chinese.mp3',
        'ilikeapples_english.mp3',
        'ilikepears_chinese.mp3',
        'ilikepears_english.mp3',
        'ilikeoranges_chinese.mp3',
        'ilikeoranges_english.mp3'
    ];
    audioPlayer = new AudioPlayer(audioPaths);
}

function stopPlaying() {
    console.log('Stop playing');
    keepGoing = false;
}

const AudioPlayerCard = () => {
    return (
        <View style={[{flexDirection:'row', alignItems:'center'}, styles.container]}>
            <TouchableOpacity onPress={load}>
                <Text style={{flex:2, marginRight:10}}>Load</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={startPlaying}>
                <Text style={{flex:2, marginRight:10}}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stopPlaying}>
                <Text style={{flex:2}}>Stop</Text>
            </TouchableOpacity>
        </View>
    );
};

export { AudioPlayerCard };
