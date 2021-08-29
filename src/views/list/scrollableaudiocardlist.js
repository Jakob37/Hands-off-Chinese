const React = require("react")
const { ScrollView } = require("react-native")
import { AudioCardList } from "./audiocardlist"

const ScrollableAudioCardList = (param) => {
    return (
        <ScrollView>
            <AudioCardList
                list={param.audioList}
                endAction={param.refreshS3List} 
            />
        </ScrollView>
    )
}

export default ScrollableAudioCardList;
