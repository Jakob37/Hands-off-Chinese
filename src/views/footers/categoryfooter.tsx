import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { addCategory } from '../../../store/actions/testcategories'
import {
    makeMultipleAudioEntries,
    makeNewAudioEntry,
} from '../../backend/apicalls'
import {
    parseCsv,
    pickFileFromDisk,
    writeCsvToDownloads,
} from '../../backend/parsing'
import { styles } from '../../style/Stylesheet'
import { FooterButton } from './util'

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

    // let categories
    // const updateCategories = () => {
    // }
    // addCategory('Added 1')
    // addCategory('Added 2')
    // addCategory('Added 3')
    const dispatch = useDispatch()
    const addCategoryHandler = (category: string) => {
        dispatch(addCategory(category))
    }
    addCategoryHandler('New category');
    let categories = useSelector((state) => state.categories.categories)

    // updateCategories()

    // const categories = useSelector((state) => state.categories.categories)

    //     <Button
    //     onPress={() => {
    //         const newCategory = `Category: ${Math.random()}`
    //         console.log('Adding category', newCategory)
    //         console.log('Existing categories:')
    //     }}
    //     title="Test the categories"
    // ></Button>

    return (
        <>
            {addEntryOpen ? (
                <>
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: 'lightgray',
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
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
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
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        },
                    ]}
                >
                    <FooterButton onPress={() => setAddEntryOpen(true)}>
                        New
                    </FooterButton>
                    <FooterButton
                        onPress={async () => {
                            const downloadData = [
                                ['Fruits', '苹果', 'Apple'],
                                ['Fruits', '牛油果', 'Avocado'],
                                ['Fruits', '柠檬', 'Lemon'],
                            ]
                            writeCsvToDownloads('fruits.csv', downloadData)
                        }}
                    >
                        Write(test)
                    </FooterButton>
                    <FooterButton
                        onPress={async () => {
                            let resultFile = await pickFileFromDisk()
                            let parsedCsv = null
                            if (resultFile != null) {
                                parsedCsv = await parseCsv(resultFile.uri)
                            } else {
                                console.log(
                                    `No result file found for ${resultFile.uri}`
                                )
                            }

                            if (parsedCsv != null) {
                                // FIXME:
                                makeMultipleAudioEntries(parsedCsv)
                            }
                        }}
                    >
                        Bulk
                    </FooterButton>
                    <FooterButton
                        onPress={param.loadDb}
                        // onPress={() => {
                        //     const newCategory = `Category: ${Math.random()}`
                        //     addCategoryHandler(newCategory);
                        // }}
                    >
                        Load
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
