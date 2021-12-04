import React, { ReactElement, useState } from "react"
import { View, Text, TextInput } from "react-native"
import { styles } from "../../style/Stylesheet"
import { FooterButton } from "./util"
import DocumentPicker from "react-native-document-picker"
import RNFS from "react-native-fs"

interface AddAudioRowParam {
    label: string
    placeholder: string
    setUpdatedText: (text: string) => void
    value: string | null
}
const AddAudioRow = (param: AddAudioRowParam) => {
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
                value={param.value != null ? param.value : undefined}
            ></TextInput>
        </View>
    )
}

interface CategoryFooterParam {
    addEntry: (english: string, chinese: string, category: string) => void
    refreshCategories: () => void
    startCategory: string
    updateCategory: (category: string) => void
}
const CategoryFooter = (param: CategoryFooterParam) => {
    const [addEntryOpen, setAddEntryOpen] = useState(false)

    const [englishText, setEnglishText] = useState("")
    const [chineseText, setChineseText] = useState("")
    const [categoryText, setCategoryText] = useState(param.startCategory)

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
                            label="Category"
                            placeholder="Category name"
                            setUpdatedText={(text) => {
                                setCategoryText(text)
                                param.updateCategory(text)
                            }}
                            value={param.startCategory}
                        ></AddAudioRow>

                        <AddAudioRow
                            label="Chinese"
                            placeholder="Chinese text"
                            setUpdatedText={(text) => setChineseText(text)}
                            value={null}
                        ></AddAudioRow>

                        <AddAudioRow
                            label="English"
                            placeholder="English text"
                            setUpdatedText={(text) => setEnglishText(text)}
                            value={null}
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
                        New
                    </FooterButton>
                    <FooterButton
                        onPress={async () => {
                            // const path = RNFS.DocumentDirectoryPath + '/test.csv'
                            const path =
                                RNFS.DownloadDirectoryPath + "/test.csv"
                            console.log("Path: ", path)
                            const fileContent = "Category,chinese,english"
                            RNFS.writeFile(path, fileContent, "utf8")
                                .then((success) => {
                                    console.log("FILE WRITTEN")
                                })
                                .catch((err) => {
                                    console.log(err.message)
                                })
                        }}
                    >
                        Write
                    </FooterButton>
                    <FooterButton
                        onPress={async () => {
                            console.log("starting new picking")
                            let resultFile = null
                            try {
                                const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                })
                                resultFile = res[0]
                                console.log(
                                    resultFile.uri,
                                    resultFile.type,
                                    resultFile.name,
                                    resultFile.size
                                )
                                // console.log(
                                //     res.uri,
                                //     res.type,
                                //     res.name,
                                //     res.size
                                // )
                            } catch (err) {
                                if (DocumentPicker.isCancel(err)) {
                                    console.log("picker cancelled")
                                } else {
                                    console.log("picker error", err)
                                    // throw err
                                }
                            }

                            if (resultFile != null) {
                                console.log('Parsing result file')
                                try {
                                    const contents = await RNFS.readFile(resultFile.uri)
                                    console.log(contents)
                                } catch (e) {
                                    console.log('Parsing error', e)
                                }
                            } else {
                                console.log('No result file found')
                            }

                            console.log("picking done")
                        }}
                    >
                        Bulk
                    </FooterButton>
                    <FooterButton onPress={param.refreshCategories}>
                        Refresh
                    </FooterButton>
                </View>
            )}
        </>
    )
}

export default CategoryFooter
