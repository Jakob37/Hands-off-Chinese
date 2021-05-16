import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { AudioPlayer, playSound, testLoad } from "./AudioPlayer";
import { styles } from "./Stylesheet";

async function startPlaying() {
    if (audioPlayer != null) {
        audioPlayer.play();
    } else {
        console.log('No audio player loaded!');
    }
}

let audioPlayer = null;

function load() {
    console.log('Loading paths');
    const audioPaths = [
        ['ilikeapples_english.mp3', 'ilikeapples_chinese.mp3'],
        ['ilikepears_english.mp3', 'ilikepears_chinese.mp3'],
        ['ilikeoranges_english.mp3', 'ilikeoranges_chinese.mp3']
    ];
    audioPlayer = new AudioPlayer(/** @type {[string,string][]} */ (audioPaths));
}

function stopPlaying() {
    console.log('Stop playing');
    audioPlayer.stop();
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
