import { styles } from "../../../components/Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

import Amplify, { Storage } from "aws-amplify";
import Sound from "react-native-sound";


const playAudio = async (key) => {

    const signedUrl = await Storage.get(key);
    console.log(signedUrl);

    const track = new Sound(signedUrl, null, (e) => {
        if (e) {
            console.log('error loading track:', e)
        } else {
            track.play()
        }
    })
}

const removeTrack = async (englishKey, chineseKey) => {
    const result1 = await Storage.remove(englishKey);
    const result2 = await Storage.remove(chineseKey);
    console.log(result1, result2);
}

const AudioCard = (param) => {
    return (
        <View style={[
            styles.card,
            { 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between' 
            }]}>
            <View>
                <TouchableOpacity onPress={() => { playAudio(param.chineseKey) }}>
                    <Text style={styles.cardText}>
                        {param.chinese}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { playAudio(param.englishKey) }}>
                    <Text style={styles.cardText}>
                        {param.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {
                removeTrack(param.chineseKey, param.englishKey).then(param.endAction)
            }}>
                <View>
                    <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 24 }}>X</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export { AudioCard };
