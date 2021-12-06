import React, { useState } from "react"
import { View } from "react-native"
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[]
    endAction: () => void
    db: HocDb
    pauseAllCurrent: () => void
}

const AudioCardList = (param: Param) => {
    const [isPausedArr, setIsPausedArr] = useState(
        Array(param.listEntries.length).fill(false)
    )

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {
                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
                            let pausedArr = Array.from(isPausedArr)
                            const currPaused = pausedArr[i]
                            pausedArr[i] = !currPaused
                            setIsPausedArr(pausedArr)
                        }}
                        isPaused={isPausedArr[i]}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
