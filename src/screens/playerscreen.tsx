import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { AudioPlayerContext, DbContext } from '../../store/contexts/contexts'
import { FloatingActionButton } from '../uicomponents/buttons'
import { icons } from '../uicomponents/style'
import { PlayerCardList } from '../views/list/playercardlist'

function PlayerScreen({ route, navigation }) {
    const { db } = useContext(DbContext)
    const { audioPlayer } = useContext(AudioPlayerContext)

    const [delay, setDelay] = useState(audioPlayer.delay / 1000)
    const [counter, setCounter] = useState(0)
    const [lastDuration, setLastDuration] = useState(0)
    const [activeNbr, setActiveNbr] = useState(0)

    // FIXME: Look over the setup up the player!
    // FIXME: How is the user handled? Why in the db?
    useEffect(() => {
        audioPlayer.load(db.getUser(), route.params.audioEntries, db)
    })
    audioPlayer.addTimerHook((number) => {
        setCounter(number)
        setActiveNbr(audioPlayer.getNumberActiveClips())
    })
    audioPlayer.addDurationHook((duration) => {
        setLastDuration(duration)
    })

    const [playedEntries, setPlayedEntries] = useState([])
    const [isPlaying, setIsPlaying] = useState(true)
    const [initialized, setInitialized] = useState(false)

    // FIXME: Right now, this will create a new hook for each new state
    // Is this needed? Or is there a better way?
    useEffect(() => {
        audioPlayer.addPlayHook('Played entries', (entry) => {
            const updated = [entry].concat(playedEntries)
            setPlayedEntries(updated)
        })
        setInitialized(true)
    }, [playedEntries])

    useEffect(() => {
        if (!audioPlayer.getIsPlaying()) {
            audioPlayer.play()
        }
    }, [initialized])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={playedEntries}
                />
            </ScrollView>
            <FloatingActionButton
                icon={!isPlaying ? icons.play : icons.pause}
                onPress={() => {
                    console.log('Clicking with the playing state:', isPlaying)
                    if (!isPlaying) {
                        console.log('Starting')
                        setIsPlaying(true)
                        audioPlayer.play()
                    } else {
                        console.log('Stopping')
                        setIsPlaying(false)
                        audioPlayer.stop()
                    }
                }}
            ></FloatingActionButton>
            {/* <PlayerFooter
                user={db.getUser()}
                audioEntries={route.params.audioEntries}
            /> */}
        </View>
    )
}

export default PlayerScreen
