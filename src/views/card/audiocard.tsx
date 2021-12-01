import { styles } from "../../style/Stylesheet"
import React from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native"

import Amplify, { Storage } from "aws-amplify"
import Sound from "react-native-sound"
import { HocDb } from "src/backend/database"

const playAudio = async (key:string, callback: ((track: Sound) => void)|null = null) => {

    const signedUrl = await Storage.get(key)

    const track = new Sound(signedUrl, null, (e) => {
        if (e) {
            console.warn("error loading track:", e)
        } else {
            if (callback != null) {
                track.play(() => {
                    callback(track)
                })
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

interface AudioCardParam {
    id: string,
    chineseKey: string,
    chinese: string,
    englishKey: string,
    english: string,
    pauseAction: () => void,
    db: HocDb
}

const AudioCard = (param: AudioCardParam) => {
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
            <View style={{flex: 1}}>
                <TouchableOpacity
                    onPress={() => {
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
                    param.db.toggleIsActive(param.id)
                    setIsPaused(!param.db.getIsActive(param.id))
                    // setIsPaused(!isPaused)
                }}
            >
                <View>
                    <Text
                        style={{
                            color: cardTextColor(),
                            fontWeight: "bold",
                            fontSize: 24,
                            margin: 20
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
