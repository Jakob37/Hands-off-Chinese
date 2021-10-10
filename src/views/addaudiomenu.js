import { createRef, useRef } from "react"
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
                placeholder={param.placeholder}
            ></TextInput>
        </View>
    )
}

const AddAudioMenu = (param) => {
    return (
        <View style={{ borderTopWidth: 1, borderTopColor: "lightgray" }}>
            <AddAudioRow
                label="Chinese"
                placeholder="Chinese text"
            ></AddAudioRow>
            <AddAudioRow
                label="English"
                placeholder="English text"
            ></AddAudioRow>
            <AddAudioRow
                label="Category"
                placeholder="Category name"
            ></AddAudioRow>
        </View>
    )
}

// export default AddAudioMenu
