import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import AudioFooter from "./audiofooter"
import CategoryFooter from "./categoryfooter"

const React = require("react")
const { View, TouchableOpacity, Text, TextInput } = require("react-native")


interface FooterParam {
    audioEntries: AudioEntryPair[],
    backToMenu: () => void,
    refreshCategories: () => void,
    addNew: (english, chinese, category) => void,
    isSelectedView: boolean,
    db: HocDb
}

const Footer = (param: FooterParam) => {
    return (
        <View>
            {param.isSelectedView ? (
                <AudioFooter
                    backToMenu={param.backToMenu}
                    audioEntries={param.audioEntries}
                    db={param.db}
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
