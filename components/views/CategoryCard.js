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

const CategoryCard = (params) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => {playAudio(params.chineseKey)}}>
                <Text style={styles.cardText}>
                    {params.chinese}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {playAudio(params.englishKey)}}>
                <Text style={styles.cardText}>
                    {params.english}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export { CategoryCard };
