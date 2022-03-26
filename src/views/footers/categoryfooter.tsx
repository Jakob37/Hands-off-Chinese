import React, { useState } from 'react'
import { useContext } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { FoldableMenuButton } from '../../uicomponents/buttons'
import {
    PausedIdsContext,
    ShownIdsContext,
} from '../../../store/contexts/contexts'
// import {
//     makeMultipleAudioEntries,
//     makeNewAudioEntry,
// } from '../../backend/apicalls'
// import {
//     parseCsv,
//     pickFileFromDisk,
//     writeCsvToDownloads,
// } from '../../backend/parsing'
import { styles } from '../../style/Stylesheet'
import { sc } from '../../uicomponents/style'

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
                    borderColor: 'gray',
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
    loadDb: () => void
}
const CategoryFooter = (param: CategoryFooterParam) => {
    const [addEntryOpen, setAddEntryOpen] = useState(false)

    const [englishText, setEnglishText] = useState('')
    const [chineseText, setChineseText] = useState('')
    const [categoryText, setCategoryText] = useState(param.startCategory)

    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
    const { shownIds } = useContext(ShownIdsContext)

    return (
        // <>
        //     {addEntryOpen ? (
        <View style={{ width: 300 }}>
            <Input placeholder="Category"></Input>
            <Input placeholder="Chinese"></Input>
            <Input placeholder="English"></Input>

            {/* <AddAudioRow
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
                ></AddAudioRow> */}
            {/* <View
                // style={[
                //     // styles.footerCard,
                //     {
                //         display: 'flex',
                //         flexDirection: 'row',
                //         justifyContent: 'space-between',
                //     },
                // ]}
            > */}
            {/* <Button
                    onPress={() => setAddEntryOpen(false)}
                    title={'Close'}
                ></Button> */}
            <Button
                onPress={() => {
                    param.addEntry(englishText, chineseText, categoryText)
                    setAddEntryOpen(false)
                }}
                title={'Submit'}
            ></Button>
            {/* </View> */}
        </View>
        // ) : (
        //         <View
        //             style={[
        //                 // styles.footerCard,
        //                 {
        //                     display: 'flex',
        //                     flexDirection: 'column',
        //                     justifyContent: 'space-between',
        //                     marginHorizontal: 0,
        //                     marginBottom: sc.componentMargins.medium,
        //                 },
        //             ]}
        //         >
        //             <FoldableMenuButton
        //                 onPress={() => setAddEntryOpen(true)}
        //                 title={'New entry'}
        //                 containerStyle={{marginBottom: 10}}
        //             ></FoldableMenuButton>
        //             {/* FIXME: Bulk upload/download should come back in some form */}
        //             {/* <FoldableMenuButton
        //                 onPress={async () => {
        //                     const downloadData = [
        //                         ['Fruits', '苹果', 'Apple'],
        //                         ['Fruits', '牛油果', 'Avocado'],
        //                         ['Fruits', '柠檬', 'Lemon'],
        //                     ]
        //                     writeCsvToDownloads('fruits.csv', downloadData)
        //                 }}
        //                 title={'Write (test)'}
        //             ></FoldableMenuButton> */}
        //             {/* <FoldableMenuButton
        //                 onPress={async () => {
        //                     let resultFile = await pickFileFromDisk()
        //                     let parsedCsv = null
        //                     if (resultFile != null) {
        //                         parsedCsv = await parseCsv(resultFile.uri)
        //                     } else {
        //                         console.log(
        //                             `No result file found for ${resultFile.uri}`
        //                         )
        //                     }

        //                     if (parsedCsv != null) {
        //                         // FIXME:
        //                         makeMultipleAudioEntries(user, parsedCsv)
        //                     }
        //                 }}
        //                 title={'Bulk upload'}
        //             ></FoldableMenuButton>
        //             <FoldableMenuButton onPress={param.loadDb} title={'Load'}></FoldableMenuButton> */}
        //             {/* <FoldableMenuButton
        //                 onPress={() => {
        //                     const updatedPausedIds = [
        //                         ...pausedIds,
        //                         ...shownIds.filter(
        //                             (shownId) => !pausedIds.includes(shownId)
        //                         ),
        //                     ]

        //                     // [...indices, Math.round(Math.random] * 10)
        //                     setPausedIds([])
        //                     // setPausedIds(updatedPausedIds)
        //                     param.refreshCategories()
        //                 }}
        //                 title={'Refresh'}
        //             ></FoldableMenuButton> */}
        //         </View>
        //     )}
        // </>
    )
}

export default CategoryFooter
