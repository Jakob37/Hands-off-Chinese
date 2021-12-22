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
    const [listState, setListState] = useState(
        param.listEntries
    )

    const handleToggleComplete = (id: string) => {
        console.log('Handled! ID:', id)
        const newList = listState.map((item) => {
            if (item.id === id) {
                const updatedItem = {
                    ...item,
                    paused: !item.paused,
                };
                // const updatedItem = item.copy()
                // updatedItem.paused = !item.paused
                return updatedItem
            }

            return item;
        });

        setListState(newList);
    }

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {

                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {

                            handleToggleComplete(audioEntry.id)

                            // console.log('Toggling')
                            // console.log('From db', param.db.getIsActive(audioEntry.id))
                            // param.db.toggleIsActive(audioEntry.id)

                            // const currObj = idToPaused;
                            // currObj[audioEntry.id] = param.db.getIsActive(audioEntry.id)
                            // setIdToPaused(currObj)

                            // let pausedArr = Array.from(isPausedArr)
                            // const currPaused = pausedArr[i]
                            // pausedArr[i] = !currPaused
                            // setIsPausedArr(pausedArr)
                        }}
                        // isPaused={isPausedArr[i]}
                        isPaused={listState[i].paused}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
