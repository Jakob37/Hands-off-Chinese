import React, { useState } from "react"
import { View } from "react-native"
import { useDispatch } from "react-redux"
import { AudioEntryPair } from "src/backend/audioentry"
import { toggleEntriesPaused } from "../../../store/actions/audioentries"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[]
    endAction: () => void
    pausedIds: Set<string>
}

const AudioCardList = (param: Param) => {

    const dispatch = useDispatch()
    const toggleEntryPausedHandler = (id: string) => {
        dispatch(toggleEntriesPaused(new Set([id])))
    }

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {

                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
                            toggleEntryPausedHandler(audioEntry.id)
                        }}
                        isPaused={
                            param.pausedIds.has(audioEntry.id)
                        }
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
