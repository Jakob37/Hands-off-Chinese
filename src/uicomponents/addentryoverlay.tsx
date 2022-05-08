import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { sc } from './style'

interface AddEntryOverlayProps {
    category: string | null
    baseLanguage: string
    learnedLanguage: string
    onSubmit: (
        categoryInput: string,
        baseLanguageInput: string,
        learnedLanguageInput: string
    ) => void
}
const AddEntryOverlay = (props: AddEntryOverlayProps) => {
    const [categoryInput, setCategoryInput] = useState('')
    const [baseLanguageInput, setBaseLanguageInput] = useState('')
    const [learnedLanguageInput, setLearnedLanguageInput] = useState('')

    return (
        <View>
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
                placeholder={props.learnedLanguage}
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
            <Button
                onPress={() => {
                    props.onSubmit(
                        props.category == null ? categoryInput : props.category,
                        baseLanguageInput,
                        learnedLanguageInput
                    )
                }}
                title={'Submit'}
            ></Button>
        </View>
    )
}

export { AddEntryOverlay }
