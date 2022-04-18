import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { AudioPlayerContext, DbContext } from '../../store/contexts/contexts'
import { FloatingActionButton } from '../uicomponents/buttons'
import { icons, sc } from '../uicomponents/style'
import { PlayerCardList } from '../views/list/playercardlist'
import { TestAudioPlayerProps } from './navigationutils'

const delayDiff = 0.5
const milliseconds = 1000

function PlayerScreen({ route, navigation }: TestAudioPlayerProps) {
    const { db } = useContext(DbContext)
    const { audioPlayer } = useContext(AudioPlayerContext)

    const [delay, setDelay] = useState(audioPlayer.delay / milliseconds)
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

    // FIXME: Comment out for auto start when entering view
    useEffect(() => {
        if (!audioPlayer.getIsPlaying()) {
            audioPlayer.play()
        }
    }, [initialized])

    return (
        <View style={{ flex: 1 }}>
            <View style={{paddingLeft: sc.componentMargins.large}}>
                <Text>Delay: {delay} seconds</Text>
            </View>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={playedEntries}
                />
            </ScrollView>

            <FloatingActionButton
                icon="angle-up"
                yPosition={2}
                onPress={() => {
                    setDelay(delay + delayDiff)
                    audioPlayer.setDelay(delay)
                    console.log('New delay:', delay)
                }}
            ></FloatingActionButton>

            <FloatingActionButton
                icon="angle-down"
                yPosition={1}
                onPress={() => {
                    setDelay(delay - delayDiff)
                    audioPlayer.setDelay(delay)
                    console.log('New delay:', delay)
                }}
            ></FloatingActionButton>

            <FloatingActionButton
                icon={!isPlaying ? icons.play : icons.pause}
                onPress={() => {
                    if (!isPlaying) {
                        setIsPlaying(true)
                        audioPlayer.play()
                    } else {
                        setIsPlaying(false)
                        audioPlayer.stop()
                    }
                }}
            ></FloatingActionButton>
        </View>
    )
}

export default PlayerScreen
