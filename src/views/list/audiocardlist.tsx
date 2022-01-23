import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { AudioEntryPair } from 'src/backend/audioentry'
import { PausedIdsContext } from '../../../store/contexts/mytestcontext'
import { toggleEntriesPaused } from '../../../store/actions/audioentries'
import { AudioCard } from '../card/audiocard'

interface Param {
    listEntries: AudioEntryPair[]
    endAction: () => void
    // pausedIds: Set<string>
}

const AudioCardList = (param: Param) => {
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    // const dispatch = useDispatch()
    // const toggleEntryPausedHandler = (id: string) => {
    //     dispatch(toggleEntriesPaused(new Set([id])))
    // }

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {
                return (
                    <AudioCard
                        key={i}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
                            console.log('Current ID', audioEntry.id)
                            console.log('Paused IDs', pausedIds)
                            if (!pausedIds.includes(audioEntry.id)) {
                                console.log('adding')
                                setPausedIds([...pausedIds, audioEntry.id])
                            } else {
                                // FIXME: Utility function
                                const spliceIndex = pausedIds.indexOf(
                                    audioEntry.id
                                )
                                pausedIds.splice(spliceIndex, 1)
                                setPausedIds([...pausedIds])
                            }
                        }}
                        isPaused={pausedIds.includes(audioEntry.id)}
                    />
                )
            })}
        </View>
    )
}

export { AudioCardList }
