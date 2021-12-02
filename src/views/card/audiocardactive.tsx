import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { HocDb } from "../..//backend/database"
import { styles } from "../../style/Stylesheet"
import { playAudio } from "./audiocard"

interface AudioCardActiveParam {
    id: string
    chineseKey: string
    chinese: string
    englishKey: string
    english: string
    cardTextColor: string
    pauseAction: () => void
    db: HocDb
    setIsPaused: (isPaused: boolean) => void
    setSettingMode: () => void
}

const AudioCardActive = (param: AudioCardActiveParam) => {
    return (
        <>
            <View style={{ flex: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        playAudio(param.chineseKey)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: param.cardTextColor },
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
                            { color: param.cardTextColor },
                        ]}
                    >
                        {param.english}
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
                        param.pauseAction()
                        param.db.toggleIsActive(param.id)
                        param.setIsPaused(!param.db.getIsActive(param.id))
                    }}
                >
                    <Icon name="pause" size={20} color="gray"></Icon>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default AudioCardActive