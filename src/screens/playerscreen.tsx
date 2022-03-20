import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import PlayerFooter from '../views/footers/playerfooter'
import { PlayerCardList } from '../views/list/playercardlist'
import { AudioPlayerContext, DbContext } from '../../store/contexts/contexts'
import { entryToString } from '../backend/audioentry'

function PlayerScreen({ route, navigation }) {
    const { db } = useContext(DbContext)
    const { audioPlayer } = useContext(AudioPlayerContext)

    const [playedEntries, setPlayedEntries] = useState([])

    // FIXME: Right now, this will create a new hook for each new state
    // Is this needed? Or is there a better way?
    useEffect(() => {
        audioPlayer.addPlayHook('Played entries', (entry) => {
            const updated = playedEntries.concat([entry])
            setPlayedEntries(updated)
        })
    }, [playedEntries])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={playedEntries}
                />
            </ScrollView>
            <PlayerFooter
                user={db.getUser()}
                audioEntries={route.params.audioEntries}
            />
        </View>
    )
}

export default PlayerScreen
