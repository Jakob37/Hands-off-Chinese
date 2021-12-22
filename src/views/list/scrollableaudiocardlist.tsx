const React = require("react")
const { ScrollView } = require("react-native")
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import { AudioCardList } from "./audiocardlist"

interface Param {
    audioList: AudioEntryPair[],
    refreshS3List: () => void,
    db: HocDb
    handleToggleComplete: (id: string) => void
}

const ScrollableAudioCardList = (param: Param) => {
    return (
        <ScrollView>
            <AudioCardList
                listEntries={param.audioList}
                endAction={param.refreshS3List} 
                db={param.db}
                handleToggleComplete={param.handleToggleComplete}
            />
        </ScrollView>
    )
}

export default ScrollableAudioCardList;
