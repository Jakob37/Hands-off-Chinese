import React, { useState } from "react"
import { View } from "react-native"
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[]
    endAction: () => void
    db: HocDb
    handleToggleComplete: (id: string) => void
}

const AudioCardList = (param: Param) => {

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {

                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
                            param.handleToggleComplete(audioEntry.id)
                        }}
                        isPaused={param.listEntries[i].paused}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
