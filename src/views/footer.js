import { useEffect, useState, ReactElement, Fragment, createRef, forwardRef } from "react"
import { LanguagePair } from "../backend/languageentry"
import { AudioPlayer } from "../audio/AudioPlayer"
import { styles } from "../Stylesheet"

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

/**
 * @param {Object} param
 * @property {[string,string][]} param.pathPairs
 * @property {() => void} param.backToMenu
 * @returns
 */
const AudioFooter = (param) => {
    useEffect(() => {
        audioPlayer.load(param.pathPairs)
    }, [param.pathPairs])

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

    // const getEnglishText = (text) => text
    // const getChineseText = (text) => text
    // const getCategoryText = (text) => text

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
                                // console.log('pressed', englishText, chineseText, categoryText)
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

// /**
//  * @param {Object} param
//  * @param {() => void} param.closeMenu
//  * @param {(english:string, chinese:string, category:string) => LanguagePair} param.addEntry
//  * @returns {React.ReactElement}
//  */
// const OpenAddEntryFooter = (param) => {
//     // const [chineseText, setChineseText] = React.useState("")
//     // const [englishText, setEnglishText] = React.useState("")
//     // const [categoryText, setCategoryText] = React.useState("")

//     // const [isOpen, setIsOpen] = React.useState(true)

//     console.log("displaying openaddentryfooter")

//     return (
//         <Fragment>
//             <View>
//                 <Text>Text</Text>
//             </View>
//             <View>
//                 <Text>Text2</Text>
//             </View>
//             <View
//                 style={[
//                     styles.footerCard,
//                     {
//                         display: "flex",
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                     },
//                 ]}
//             >
//                 <FooterButton onPress={param.closeMenu()}>Close</FooterButton>
//                 {/* <FooterButton
//                     onPress={(english, chinese, category) => {
//                         param.addEntry(english, chinese, category)
//                         param.closeMenu()
//                     }}
//                 >
//                     Submit entry to AWS
//                 </FooterButton> */}
//             </View>
//         </Fragment>
//     )
// }

/**
 * @param {Object} param
 * @property {[string,string][]} param.pathPairs
 * @property {() => void} param.backToMenu
 * @property {() => void} param.refreshCategories
 * @property {(english, chinese, category) => LanguagePair} param.addNew
 * @property {boolean} param.isSelectedView
 * @property {boolean} param.entryMenuOpen
 * @returns {React.ReactElement}
 */
const Footer = (param) => {
    return (
        <View>
            {param.isSelectedView ? (
                <AudioFooter
                    backToMenu={param.backToMenu}
                    pathPairs={param.pathPairs}
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
