import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { HocDb } from "src/backend/database"
import { AudioPlayer } from "../../audio/AudioPlayer"
import { AudioEntryPair } from "../../backend/audioentry"
import { styles } from "../../style/Stylesheet"
import { FooterButton } from "./util"

const audioPlayer = new AudioPlayer()

interface AudioPlayerRowParam {
    label: string
    placeholder: string
    setUpdatedText: (text: string) => void
}

const fontSize = 16;

const AudioPlayerRow = (param: AudioPlayerRowParam) => {

    const [counter, setCounter] = useState(0)
    const [lastDuration, setLastDuration] = useState(0)

    const [activeNbr, setActiveNbr] = useState(0)

    audioPlayer.addTimerHook((number) => {
        setCounter(number)
        setActiveNbr(audioPlayer.getNumberActiveClips())
    })

    audioPlayer.addDurationHook((duration) => {
        setLastDuration(duration)
    })

    return (
        <View style={[styles.inputField, {display:"flex", flexDirection:"row", justifyContent:"space-between"}]}>
            <Text style={{ fontSize }}>{`${audioPlayer.delay/1000}s`}</Text>
            <Text style={{ fontSize }}>{`Time: ${counter}s`}</Text>
            <Text style={{ fontSize }}>{`Nbr active: ${activeNbr}`}</Text>
            <Text style={{ fontSize }}>{`${audioPlayer.getState()}`}</Text>
        </View>
    )
}

interface AudioFooterParam {
    audioEntries: AudioEntryPair[]
    backToMenu: () => void
    db: HocDb
}
const AudioFooter = (param: AudioFooterParam) => {
    useEffect(() => {
        audioPlayer.load(param.audioEntries, param.db)
    }, [param.audioEntries])

    return (
        <>
            <AudioPlayerRow
                label="test"
                placeholder="test2"
                setUpdatedText={(text) => console.log(text)}
            />
            <View
                style={[
                    styles.footerCard,
                    {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    },
                ]}
            >
                <FooterButton
                    onPress={() => {
                        audioPlayer.play()
                    }}
                >
                    Play
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        audioPlayer.playRandom()
                    }}
                >
                    Random
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        audioPlayer.stop()
                    }}
                >
                    Stop
                </FooterButton>
                <FooterButton onPress={param.backToMenu}>Back</FooterButton>
            </View>
        </>
    )
}

export default AudioFooter
