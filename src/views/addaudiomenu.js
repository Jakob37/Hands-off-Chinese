import { createRef, useRef } from "react";
import { styles } from "../Stylesheet.js"

const React = require("react")
const { View, Text, TextInput } = require("react-native")

const AddAudioRow = (param) => {

    const reference = createRef()

    return (
        <View style={styles.inputField}>
            <Text style={{ fontSize: 16, flex: 1 }}>{param.label}</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    flex: 3,
                }}
                ref={reference}
                // value={param.text}
                // onChangeText={(text) => param.setChineseText(text)}
                placeholder="Chinese text"
            ></TextInput>
        </View>
    )
}

const AddAudioMenu = (param) => {
    return (
        <View style={{ borderTopWidth: 1, borderTopColor: "lightgray" }}>
            <AddAudioRow label="Chinese"></AddAudioRow>
            <AddAudioRow label="English"></AddAudioRow>
            <AddAudioRow label="Category"></AddAudioRow>
            {/* <View style={styles.inputField}>
                <Text style={{ fontSize: 16, flex: 1 }}>Category</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        flex: 3,
                    }}
                    value={param.categoryText}
                    onChangeText={(text) => param.setCategoryText(text)}
                    placeholder="Category text"
                ></TextInput>
            </View>
            <View style={styles.inputField}>
                <Text style={{ fontSize: 16, flex: 1 }}>Chinese</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        flex: 3,
                    }}
                    value={param.chineseText}
                    onChangeText={(text) => param.setChineseText(text)}
                    placeholder="Chinese text"
                ></TextInput>
            </View>
            <View style={styles.inputField}>
                <Text style={{ fontSize: 16, flex: 1 }}>English</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        flex: 3,
                    }}
                    value={param.englishText}
                    onChangeText={(text) => param.setEnglishText(text)}
                    placeholder="English test"
                ></TextInput> */}
            {/* </View> */}
        </View>
    )
}

export default AddAudioMenu
