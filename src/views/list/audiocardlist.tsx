import React from "react"
import { View } from "react-native"
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[],
    endAction: () => void,
    db: HocDb
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
                                db={param.db}
                                id={audioObj.id}
                                english={audioObj.englishText}
                                englishKey={audioObj.englishFilename}
                                chinese={audioObj.chineseText}
                                chineseKey={audioObj.chineseFilename}
                                pauseAction={() => {
                                    // param.db.toggleIsActive(audioObj.id)
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
