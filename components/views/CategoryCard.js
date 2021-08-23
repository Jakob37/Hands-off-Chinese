import { styles } from "../Stylesheet";
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

const CategoryCard = (params) => {
    return (
        <View style={[styles.card, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View>
                <TouchableOpacity onPress={() => { playAudio(params.chineseKey) }}>
                    <Text style={styles.cardText}>
                        {params.chinese}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { playAudio(params.englishKey) }}>
                    <Text style={styles.cardText}>
                        {params.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => { 
                removeTrack(params.chineseKey, params.englishKey).then(params.endAction)
            }}>
                <View>
                    <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 24 }}>X</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export { CategoryCard };
