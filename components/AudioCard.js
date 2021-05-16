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

// import { default as Sound } from "react-native-sound";
import { styles } from "./Stylesheet";
import { playSound } from "./AudioPlayer";

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

export { AudioCard };
