import React, { useState } from "react"
import { View } from "react-native"
import { useDispatch } from "react-redux"
import { AudioEntryPair } from "src/backend/audioentry"
import { toggleEntryPaused } from "../../../store/actions/audioentries"
import { AudioCard } from "../card/audiocard"

interface Param {
    listEntries: AudioEntryPair[]
    endAction: () => void
    handleToggleComplete: (id: string) => void
}

const AudioCardList = (param: Param) => {

    const dispatch = useDispatch()
    const toggleEntryPausedHandler = (id: string) => {
        dispatch(toggleEntryPaused(id))
    }

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {

                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
                            // console.log('Toggle paused', audioEntry)
                            // console.log('i', i)
                            console.log('Toggling ID', audioEntry.id)
                            toggleEntryPausedHandler(audioEntry.id)
                            // param.handleToggleComplete(audioEntry.id)
                        }}
                        isPaused={param.listEntries[i].paused}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
