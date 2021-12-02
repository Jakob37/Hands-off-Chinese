import React from "react"
import { View, Text } from "react-native"
import ClickableIcon from "../../util/clickableicon"

interface AudioCardSettingsInterface {
    removeCallback: () => void
    backCallback: () => void
    minCardHeight: number
}

const AudioCardSettings = (param: AudioCardSettingsInterface) => {
    return (
        <View
            style={{
                height: param.minCardHeight,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
            }}
        >
            <ClickableIcon
                icon="times"
                size={30}
                color="gray"
                clickCallback={param.removeCallback}
            />
            <ClickableIcon
                icon="exchange"
                size={30}
                color="gray"
                clickCallback={param.backCallback}
            />
        </View>
    )
}

export default AudioCardSettings
