const React = require("react")
const { ScrollView } = require("react-native")
import { AudioEntryPair } from "src/backend/audioentry"
import { AudioCardList } from "./audiocardlist"

interface Param {
    audioList: AudioEntryPair[],
    refreshS3List: () => void
}

const ScrollableAudioCardList = (param: Param) => {
    return (
        <ScrollView>
            <AudioCardList
                listEntries={param.audioList}
                endAction={param.refreshS3List} 
            />
        </ScrollView>
    )
}

export default ScrollableAudioCardList;
