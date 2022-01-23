const React = require("react")
const { ScrollView } = require("react-native")
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import { AudioCardList } from "./audiocardlist"

interface Param {
    audioList: AudioEntryPair[],
    refreshS3List: () => void,
    // pausedIds: Set<string>
}

const ScrollableAudioCardList = (param: Param) => {
    return (
        <ScrollView>
            <AudioCardList
                listEntries={param.audioList}
                endAction={param.refreshS3List} 
                // pausedIds={param.pausedIds}
            />
        </ScrollView>
    )
}

export default ScrollableAudioCardList;
