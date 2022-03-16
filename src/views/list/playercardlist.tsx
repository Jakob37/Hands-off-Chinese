import React, { useContext } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import { PausedIdsContext } from '../../../store/contexts/mytestcontext'
import { PlayerCard } from '../card/playercard'

interface Param {
    listEntries: AudioEntryPair[]
    user: string
}

const PlayerCardList = (param: Param) => {
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    useEffect(() => {
        console.log('--- Testing responding pausedIds change ---')
    }, [pausedIds])

    return (
        <View>
            {param.listEntries.map((audioEntry, i) => {
                return (
                    <PlayerCard
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

export { PlayerCardList }
