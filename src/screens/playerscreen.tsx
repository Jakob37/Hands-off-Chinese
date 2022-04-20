import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { getRandomFromArray } from '../util/util'
import { AudioPlayerContext, DbContext } from '../../store/contexts/contexts'
import { FloatingActionButton } from '../uicomponents/buttons'
import { icons, sc } from '../uicomponents/style'
import { PlayerCardList } from '../views/list/playercardlist'
import { AudioPlayerProps } from './navigationutils'
import NewAudioPlayer from './testaudioplayer'
import { AudioEntryPair } from '../backend/audioentry'

const delayDiff = 0.5
const milliseconds = 1000

const AudioState = Object.freeze({
    stopped: 0,
    playing_english: 1,
    english_pause: 2,
    playing_chinese: 3,
    chinese_pause: 4,
})

function PlayerScreen({ route, navigation }: AudioPlayerProps) {
    const { db } = useContext(DbContext)
    const { audioPlayer } = useContext(AudioPlayerContext)

    // const [delay, setDelay] = useState(audioPlayer.delay / milliseconds)
    const [counter, setCounter] = useState(0)
    const [lastDuration, setLastDuration] = useState(0)
    const [activeNbr, setActiveNbr] = useState(0)


    const [startTime, setStartTime] = useState(0)
    const [audioState, setAudioState] = useState(AudioState.stopped)

    const [currentAudioPair, setCurrentAudioPair] = useState<AudioEntryPair|null>(null)

    const getAudioPairs = (): AudioEntryPair[] => {
        return route.params.audioEntries
    }

    const stop = () => {

    }

    const play = () => {
        setStartTime(new Date().getTime())

        if (getAudioPairs().length == 0) {
            stop()
            return
        }

        console.log('Playing with state', this.audioState)

        if (this.audioState == AudioState.playing_english) {
            const audioEntry = getRandomFromArray(getAudioPairs())
            this.audioState = AudioState.english_pause
            setCurrentAudioPair(audioEntry)

            // for (const [name, hook] of Array.from(this.playHooks)) {
            //     console.log('Hooking for label:', name)
            //     hook(copyEntry(audioEntry))
            // }
        } else if (this.audioState == AudioState.english_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_chinese
        } else if (this.audioState == AudioState.playing_chinese) {
            const currAudio = this.currentlyPlayingPair
            // playAudio(currAudio.chineseKey, this.user, (sound: Sound) => {
            //     this.playEvent()
            //     this.durationHook(Math.round(sound.getDuration()))
            // })
            this.audioState = AudioState.chinese_pause
            // this.playedEntries.push(currAudio)
        } else if (this.audioState == AudioState.chinese_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_english
        } else {
            console.warn('Unknown situation for audio state:', this.audioState)
        }

    }

    // const getRandom = () => {
    //     const audioEntry = getRandomFromArray(route.params.audioEntries)

    // }

    // FIXME: Look over the setup up the player!
    // FIXME: How is the user handled? Why in the db?
    // useEffect(() => {
    //     audioPlayer.load(db.getUser(), route.params.audioEntries, db)
    // })
    // audioPlayer.addTimerHook((number) => {
    //     setCounter(number)
    //     setActiveNbr(audioPlayer.getNumberActiveClips())
    // })
    // audioPlayer.addDurationHook((duration) => {
    //     setLastDuration(duration)
    // })

    const [playedEntries, setPlayedEntries] = useState([])
    const [isPlaying, setIsPlaying] = useState(true)
    const [initialized, setInitialized] = useState(false)

    // FIXME: Right now, this will create a new hook for each new state
    // Is this needed? Or is there a better way?
    // useEffect(() => {
    //     audioPlayer.addPlayHook('Played entries', (entry) => {
    //         const updated = [entry].concat(playedEntries)
    //         setPlayedEntries(updated)
    //     })
    //     setInitialized(true)
    // }, [playedEntries])

    // FIXME: Comment out for auto start when entering view
    // useEffect(() => {
    //     if (!audioPlayer.getIsPlaying()) {
    //         audioPlayer.play()
    //     }
    // }, [initialized])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingLeft: sc.componentMargins.large }}>
                {/* <Text>Delay: {delay} seconds</Text> */}
            </View>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={playedEntries}
                />
            </ScrollView>

            {/* FIXME: Why is it pushed down into the bottom without the min height? */}
            <View style={{ justifyContent: 'flex-end', minHeight: '25%' }}>
                <NewAudioPlayer
                    audioEntries={route.params.audioEntries}
                ></NewAudioPlayer>
            </View>

            {/* <FloatingActionButton
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
            ></FloatingActionButton> */}
        </View>
    )
}

export default PlayerScreen
