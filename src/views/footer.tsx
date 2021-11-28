import { useEffect, useState, ReactElement, Fragment, createRef, forwardRef } from "react"
import { AudioEntryPair } from "src/backend/audioentry"
import { AudioPlayer } from "../audio/AudioPlayer"
import { styles } from "../style/Stylesheet"

const React = require("react")
const { View, TouchableOpacity, Text, TextInput } = require("react-native")

const fontSize = 16

const audioPlayer = new AudioPlayer()

const FooterButton = (param) => {
    return (
        <TouchableOpacity onPress={param.onPress}>
            <Text style={{ fontSize }}>{param.children}</Text>
        </TouchableOpacity>
    )
}

/**
 * @param {Object} param
 * @property {string} label
 * @property {string} placeholder
 * @property {(text:string) => string} setUpdatedText
 * @returns
 */
const AddAudioRow = (param) => {

    return (
        <View style={styles.inputField}>
            <Text style={{ fontSize: 16, flex: 1 }}>{param.label}</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    flex: 3,
                }}
                onChangeText={(newText) => param.setUpdatedText(newText)}
                placeholder={param.placeholder}
            ></TextInput>
        </View>
    )
}

interface AudioFooterParam {
    audioEntries: AudioEntryPair[],
    backToMenu: () => void
}
const AudioFooter = (param: AudioFooterParam) => {
    useEffect(() => {
        audioPlayer.load(param.audioEntries)
    }, [param.audioEntries])

    return (
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
    )
}

/**
 * @param {Object} param
 * @property {(english:string, chinese:string, category:string) => void} addEntry
 * @property {() => void} refreshCategories
 * @returns {ReactElement}
 */
const CategoryFooter = (param) => {
    const [addEntryOpen, setAddEntryOpen] = useState(false)

    const [englishText, setEnglishText] = useState('')
    const [chineseText, setChineseText] = useState('')
    const [categoryText, setCategoryText] = useState('')

    return (
        <>
            {addEntryOpen ? (
                <>
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: "lightgray",
                        }}
                    >
                        <AddAudioRow
                            label="Chinese"
                            placeholder="Chinese text"
                            setUpdatedText={(text) => setChineseText(text)}
                        ></AddAudioRow>
                        <AddAudioRow
                            label="English"
                            placeholder="English text"
                            setUpdatedText={(text) => setEnglishText(text)}
                        ></AddAudioRow>
                        <AddAudioRow
                            label="Category"
                            placeholder="Category name"
                            setUpdatedText={(text) => setCategoryText(text)}
                        ></AddAudioRow>
                    </View>
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
                        <FooterButton onPress={() => setAddEntryOpen(false)}>
                            Close
                        </FooterButton>
                        <FooterButton
                            onPress={() => {
                                param.addEntry(
                                    englishText,
                                    chineseText,
                                    categoryText
                                )
                                setAddEntryOpen(false)
                            }}
                        >
                            Submit entry to AWS
                        </FooterButton>
                    </View>
                </>
            ) : (
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
                    <FooterButton onPress={() => setAddEntryOpen(true)}>
                        Add new entry
                    </FooterButton>
                    <FooterButton onPress={param.refreshCategories}>
                        Refresh
                    </FooterButton>
                </View>
            )}
        </>
    )
}

interface FooterParam {
    audioEntries: AudioEntryPair[],
    backToMenu: () => void,
    refreshCategories: () => void,
    addNew: (english, chinese, category) => void,
    isSelectedView: boolean,
}


const Footer = (param: FooterParam) => {
    return (
        <View>
            {param.isSelectedView ? (
                <AudioFooter
                    backToMenu={param.backToMenu}
                    audioEntries={param.audioEntries}
                />
            ) : (
                <CategoryFooter
                    refreshCategories={param.refreshCategories}
                    addEntry={param.addNew}
                />
            )}
        </View>
    )
}

export default Footer
