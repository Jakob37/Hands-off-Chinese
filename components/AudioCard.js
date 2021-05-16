"use strict";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Pressable,
} from "react-native";
import React from "react";

import { AudioPaths } from "./AudioPaths";

import { default as Sound } from "react-native-sound";

Sound.setCategory("Playback");

function playSound(soundPath) {
    console.log(soundPath);
    const appleSound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log(
                "failed to load the sound",
                error,
                "from path",
                soundPath
            );
            return;
        }

        appleSound.play((success) => {
            if (success) {
                console.log("Successfully finished playing");
            } else {
                console.log("Playback failed due to audio decoding errors");
            }
        });
    });
}

/**
 * @param {object} param
 * @param {string} param.label
 * @param {string} param.english
 * @param {string} param.chinese
 * @returns
 */
const AudioCard = ({ label, english, chinese }) => {
    return (
        <View>
            <Text style={styles.container}>
                <TouchableOpacity>
                    <Text style={{ marginRight: 10 }}>{label}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => playSound(english)}>
                    <Text>Play English</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => playSound(chinese)}>
                    <Text>Play Chinese</Text>
                </TouchableOpacity>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    linkContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    link: {
        flex: 2,
        fontSize: 18,
        fontWeight: "400",
        color: "black",
    },
    description: {
        flex: 3,
        paddingVertical: 16,
        fontWeight: "400",
        fontSize: 18,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
});

export { AudioCard };
