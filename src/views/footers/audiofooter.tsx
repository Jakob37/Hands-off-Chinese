import React, { useEffect, Fragment } from "react"
import { TextInput, View, Text } from "react-native"
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
    return (
        <View style={[styles.inputField, {display:"flex", flexDirection:"row", justifyContent:"space-between"}]}>
            <Text style={{ fontSize }}>Delay: 10s</Text>
            <Text style={{ fontSize }}>Play: 2x</Text>
            <Text style={{ fontSize }}>Curr: 1/4s</Text>
        </View>
    )
}

interface AudioFooterParam {
    audioEntries: AudioEntryPair[]
    backToMenu: () => void
}
const AudioFooter = (param: AudioFooterParam) => {
    useEffect(() => {
        audioPlayer.load(param.audioEntries)
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
