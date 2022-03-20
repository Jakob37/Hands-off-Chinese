import React, { useContext } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import { PausedIdsContext } from '../../../store/contexts/contexts'
import { AudioCard } from '../card/audiocard'

interface Param {
    listEntries: AudioEntryPair[]
    user: string
}

const AudioCardList = (param: Param) => {
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    useEffect(() => {
        console.log('--- Testing responding pausedIds change ---')
    }, [pausedIds])

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {
                return (
                    <AudioCard
                        key={i}
                        user={param.user}
                        audioEntryPair={audioEntry}
                        togglePaused={() => {
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
