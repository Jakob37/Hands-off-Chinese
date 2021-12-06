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
            {param.listEntries.map((audioObj, i) => {
                return (
                    <AudioCard
                        key={i}
                        id={audioObj.id}
                        english={audioObj.englishText}
                        englishKey={audioObj.englishFilename}
                        chinese={audioObj.chineseText}
                        chineseKey={audioObj.chineseFilename}
                        togglePaused={() => {
                            console.log('---')
                            let pausedArr = Array.from(isPausedArr)
                            console.log(pausedArr)
                            const currPaused = pausedArr[i]
                            console.log(currPaused)

                            pausedArr[i] = !currPaused
                            console.log(pausedArr)
                            setIsPausedArr(pausedArr)

                            // const currArr = Array(isPaused)
                            // currArr[i] = true
                            // currArr[i] = isPaused
                            // setIsPausedArr(currArr)
                        }}
                        isPaused={isPausedArr[i]}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
