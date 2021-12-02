import { styles } from "../../style/Stylesheet"
import React from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native"

import Amplify, { Storage } from "aws-amplify"
import Sound from "react-native-sound"
import { HocDb } from "src/backend/database"
import Icon from "react-native-vector-icons/FontAwesome"
import AudioCardActive from "./audiocardactive"
import AudioCardSettings from "./audiocardsettings"

const playAudio = async (
    key: string,
    callback: ((track: Sound) => void) | null = null
) => {
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
    id: string
    chineseKey: string
    chinese: string
    englishKey: string
    english: string
    pauseAction: () => void
    db: HocDb
}

const AudioCard = (param: AudioCardParam) => {
    const [isPaused, setIsPaused] = React.useState(false)
    const [settingMode, setSettingMode] = React.useState(false)
    const [cardHeight, setCardHeight] = React.useState(0)

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
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout
                if (height > cardHeight) {
                    setCardHeight(height)
                }
            }}
        >
            {settingMode ? (
                <AudioCardSettings
                    removeCallback={() => {
                        console.warn('Not implemented!')
                    }}
                    backCallback={() => {
                        setSettingMode(false)
                    }}
                    minCardHeight={cardHeight}
                />
            ) : (
                <AudioCardActive
                    id={param.id}
                    chineseKey={param.chineseKey}
                    chinese={param.chinese}
                    englishKey={param.englishKey}
                    english={param.english}
                    cardTextColor={cardTextColor()}
                    pauseAction={param.pauseAction}
                    db={param.db}
                    setIsPaused={setIsPaused}
                    setSettingMode={() => {
                        setSettingMode(true)
                    }}
                ></AudioCardActive>
            )}
        </View>
    )
}

export { AudioCard, playAudio }
