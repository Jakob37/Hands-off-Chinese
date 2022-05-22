import { LANGUAGES } from '../../config'
import React, { useEffect, useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, ButtonGroup, Input } from 'react-native-elements'
import { sc } from './style'
import { upperCaseFirst } from '../util/util'

interface AddEntryOverlayProps {
    category: string | null
    baseLanguage: string
    learnedLanguage: string
    onSubmit: (
        learnedLanguage: 'swedish'|'chinese',
        categoryInput: string,
        baseLanguageInput: string,
        learnedLanguageInput: string
    ) => void
    onCancel: () => void
}
const AddEntryOverlay = (props: AddEntryOverlayProps) => {
    const [categoryInput, setCategoryInput] = useState('')
    const [baseLanguageInput, setBaseLanguageInput] = useState('')
    const [learnedLanguageInput, setLearnedLanguageInput] = useState('')

    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View>
                <ButtonGroup
                    buttons={LANGUAGES.map((str) => upperCaseFirst(str))}
                    selectedIndex={selectedIndex}
                    onPress={(value) => {
                        setSelectedIndex(value)
                    }}
                ></ButtonGroup>
            </View>

            <Text
                style={{
                    marginHorizontal: sc.componentMargins.medium,
                    fontSize: sc.fontSizes.cardLarge,
                    paddingBottom: sc.componentMargins.medium,
                }}
            >
                Please enter a sentence
            </Text>
            {props.category == null ? (
                <Input
                    placeholder="Category"
                    onChangeText={(text) => setCategoryInput(text)}
                ></Input>
            ) : (
                <Text>Current category: {props.category}</Text>
            )}

            <Input
                placeholder={upperCaseFirst(LANGUAGES[selectedIndex])}
                onChangeText={(text) => setLearnedLanguageInput(text)}
                multiline={true}
                numberOfLines={sc.input.nbrRows}
            ></Input>
            <Input
                placeholder={props.baseLanguage}
                onChangeText={(text) => setBaseLanguageInput(text)}
                multiline={true}
                numberOfLines={sc.input.nbrRows}
            ></Input>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                }}
            >
                <Button
                    onPress={() => {
                        props.onCancel()
                    }}
                    title={'Back'}
                ></Button>
                <Button
                    onPress={() => {
                        props.onSubmit(
                            LANGUAGES[selectedIndex],
                            props.category == null
                                ? categoryInput
                                : props.category,
                            baseLanguageInput,
                            learnedLanguageInput
                        )
                    }}
                    title={'Submit'}
                ></Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export { AddEntryOverlay }
