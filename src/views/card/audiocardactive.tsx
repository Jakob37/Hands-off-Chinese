import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "../..//backend/database"
import { styles } from "../../style/Stylesheet"
import { playAudio } from "./audiocard"

interface AudioCardActiveParam {
    // id: string
    // chineseKey: string
    // chinese: string
    // englishKey: string
    // english: string
    audioEntryPair: AudioEntryPair
    cardTextColor: string
    // pauseAction: () => void
    // db: HocDb
    togglePaused: () => void
    setSettingMode: () => void
}

const AudioCardActive = (param: AudioCardActiveParam) => {
    return (
        <>
            <View style={{ flex: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        playAudio(param.audioEntryPair.chineseKey)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: param.cardTextColor },
                        ]}
                    >
                        {param.audioEntryPair.chinese}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        playAudio(param.audioEntryPair.englishKey)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: param.cardTextColor },
                        ]}
                    >
                        {param.audioEntryPair.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        param.setSettingMode()
                    }}
                >
                    <Icon name="gear" size={20} color="gray"></Icon>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        param.togglePaused()
                        // param.pauseAction()
                        // param.db.toggleIsActive(param.id)
                        // param.setIsPaused(!param.db.getIsActive(param.id))
                    }}
                >
                    <Icon name="pause" size={20} color="gray"></Icon>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default AudioCardActive