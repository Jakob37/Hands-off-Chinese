import { styles } from "../../style/Stylesheet"
import React from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native"

import Amplify, { Storage } from "aws-amplify"
import Sound from "react-native-sound"

/**
 * @param {string} key
 * @param {() => void|null} [callback=null]
 */
const playAudio = async (key, callback = null) => {

    const signedUrl = await Storage.get(key)

    // const signedUrl = 'https://handsoffchinesestorage183310-dev.s3.eu-west-1.amazonaws.com/public/210822144607_I+am+eating+apple.mp3'
    // console.log('will try playing', signedUrl)
    const track = new Sound(signedUrl, null, (e) => {
        if (e) {
            console.warn("error loading track:", e)
        } else {
            if (callback != null) {
                track.play(callback)
            } else {
                track.play()
            }
        }
    })
}

/**
 * @param {string} englishKey
 * @param {string} chineseKey
 */
const removeTrack = async (englishKey, chineseKey) => {
    const result1 = await Storage.remove(englishKey)
    const result2 = await Storage.remove(chineseKey)
}

const AudioCard = (param) => {
    const [isPaused, setIsPaused] = React.useState(false)

    const cardTextColor = () => {
        return isPaused ? "gray" : "black"
    }

    return (
        <View
            style={[
                styles.card,
                {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                },
            ]}
        >
            <View>
                <TouchableOpacity
                    onPress={() => {
                        console.log('play audio for', param.chineseKey)
                        playAudio(param.chineseKey)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: cardTextColor() },
                        ]}
                    >
                        {param.chinese}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        playAudio(param.englishKey)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: cardTextColor() },
                        ]}
                    >
                        {param.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
                    param.pauseAction()
                    setIsPaused(!isPaused)
                }}
            >
                <View>
                    <Text
                        style={{
                            color: cardTextColor(),
                            fontWeight: "bold",
                            fontSize: 12,
                        }}
                    >
                        | |
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export { AudioCard, playAudio }
