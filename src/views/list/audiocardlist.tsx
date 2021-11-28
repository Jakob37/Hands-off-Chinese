import React from "react"
import { View } from "react-native"
import { AudioEntryPair } from "src/backend/audioentry"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[],
    endAction: () => void
}

const AudioCardList = (param: Param) => {
    return (
        <View>
            <View>
                {
                    param.listEntries.map((audioObj, i) => {
                        return (
                            <AudioCard
                                key={i}
                                english={audioObj.englishText}
                                englishKey={audioObj.englishFilename}
                                chinese={audioObj.chineseText}
                                chineseKey={audioObj.chineseFilename}
                                isActive={!audioObj.paused}
                                endAction={param.endAction}
                                pauseAction={() => {
                                    console.warn("Pause action! Key:", i)
                                }}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export { AudioCardList }
