import React, { useEffect, useState } from 'react'
import {
    View,
    Image,
    Text,
    Slider,
    TouchableOpacity,
    Platform,
} from 'react-native'
import ClickableIcon from '../uicomponents/clickableicon'

import { NewAudioPlayerClass } from '../audio/NewAudioPlayer'
import { AudioEntryPair } from '../backend/audioentry'
import { getSignedUrl } from '../views/card/util'

const img_pause = require('../../resources/ui_pause.png')
const img_play = require('../../resources/ui_play.png')
const img_playjumpleft = require('../../resources/ui_playjumpleft.png')
const img_playjumpright = require('../../resources/ui_playjumpright.png')
const test_mp3 = require('../../resources/file_example.mp3')

const JUMP_SECONDS = 1
const SMALL_BUTTON_SIZE = 30
const SMALL_BUTTON_TINT = 'gray'
const SILENCE_SECONDS = 3

// TP: Could these modes be used as a source here?
const PLAYER_MODES = {
    // english_chinese: ['chinese', 'silence'],
    english_chinese: ['english', 'silence', 'chinese', 'silence'],
    chinese_only: ['chinese', 'pause'],
    chinese_english: ['chinese', 'silence', 'english', 'silence'],
} as Record<string, ('english' | 'chinese' | 'silence')[]>

const audioPlayer = new NewAudioPlayerClass()

interface NewAudioPlayerProps {
    audioEntries: AudioEntryPair[]
    newEntryCallback: (newEntry: AudioEntryPair) => void
}
function NewAudioPlayer(props: NewAudioPlayerProps) {
    const [playLanguages, setPlayLanguages] = useState<
        ('english' | 'chinese' | 'silence')[]
    >(PLAYER_MODES.english_chinese)
    const [playAudioIndices, setPlayAudioIndices] = useState({
        language: 0,
        audio: 0,
    })
    // const [audioEntryIndex, setAudioEntryIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [soundName, setSoundName] = useState('')
    const [silenceDurationSeconds, setSilenceDuration] =
        useState(SILENCE_SECONDS)

    const [soundOrSilence, setSoundOrSilence] =
        useState<'sound' | 'silence'>('sound')

    const incrementPlayModeIndex = () => {
        let playIndex = playAudioIndices.language + 1
        let entryIndex = playAudioIndices.audio
        if (playIndex >= playLanguages.length) {
            playIndex -= playLanguages.length
            entryIndex = (entryIndex + 1) % props.audioEntries.length
        }

        setPlayAudioIndices({ language: playIndex, audio: entryIndex })
        // setAudioEntryIndex(entryIndex)
    }

    useEffect(() => {
        console.log('Changing silence duration to', silenceDurationSeconds)
        audioPlayer.changeSilenceDuration(silenceDurationSeconds)
    }, [silenceDurationSeconds])

    // When audio entries changes
    useEffect(() => {
        return () => {
            console.log('--- Detaching')
            setPlaySeconds(0)
            audioPlayer.detach()
            setSoundName('')
        }
    }, [props.audioEntries])

    useEffect(() => {
        console.log('>>> Initializing audio player')
        audioPlayer.init(soundOrSilence, (time) => {
            setPlaySeconds(time)
        })
        audioPlayer.setPlayCompleteCallback(
            () => {
                incrementPlayModeIndex()
            },
            false,
            null
        )

        if (isPlaying) {
            console.log(
                '[Screen] unpause, state:',
                playAudioIndices,
                'is playing',
                isPlaying
            )
            audioPlayer.unpause()
        } else {
            console.log(
                '[Screen] pause, state:',
                playAudioIndices,
                'is playing',
                isPlaying
            )
            audioPlayer.pause()
        }

        // Seems like the 'isPlaying' is needed to update the callbacks on pause
    }, [props.audioEntries, isPlaying])

    useEffect(() => {
        console.log('[Screen] audio indices', playAudioIndices)
        // const soundOrSilence =
        //     playAudioIndices.language == 1 ? 'silence' : 'sound'
        const soundOrSilence =
            playLanguages[playAudioIndices.language] == 'silence'
                ? 'silence'
                : 'sound'
        setSoundOrSilence(soundOrSilence)
        audioPlayer.setPlayCompleteCallback(
            () => {
                incrementPlayModeIndex()
            },
            true,
            soundOrSilence
        )
        // playNew()
    }, [playAudioIndices])

    // FIXME: Reduce away the 'soundOrSilence' state, and calculate directly
    // from the indices
    useEffect(() => {
        playNew()
    }, [soundOrSilence])

    const playNew = () => {
        // const playingLanguage = playLanguages[playAudioIndices.language]
        console.log('[Screen] playingLanguage', soundOrSilence)
        if (soundOrSilence != 'silence') {
            console.log('[Screen] Loading sound')
            loadSound(() => {
                console.log('[Screen] Loading completed')
                // FIXME: This is the issue, isn't it?
                if (isPlaying) {
                    audioPlayer.playSound()
                }
            })
        } else {
            // FIXME: Return this
            console.log('[Screen] Playing silence')
            audioPlayer.playSilence(silenceDurationSeconds * 1000)
            setDuration(silenceDurationSeconds)
        }
    }

    const loadSound = async (loadCompleteCallback: () => void) => {
        console.assert(props.audioEntries.length > 0)

        console.log('[Screen] loadSound')

        const playingLanguage = playLanguages[playAudioIndices.language]

        const currAudioEntry = props.audioEntries[playAudioIndices.audio]
        if (playAudioIndices.language == 0) {
            props.newEntryCallback(currAudioEntry)
        }
        const user = currAudioEntry.user
        const id =
            playingLanguage == 'chinese'
                ? currAudioEntry.chineseKey
                : currAudioEntry.englishKey
        const key = `${user}/${id}`
        const url = await getSignedUrl(key)

        setSoundName(key)

        audioPlayer.loadAudio(
            url,
            key,
            (error) => {
                console.log('failed to load the sound', error)
                setIsPlaying(false)
            },
            (sound) => {
                setDuration(sound.getDuration())
                loadCompleteCallback()
            }
        )
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <ClickableIcon
                    icon="minus-square-o"
                    clickCallback={() => {
                        setSilenceDuration(silenceDurationSeconds - 1)
                    }}
                ></ClickableIcon>

                <View style={{ justifyContent: 'center' }}>
                    <Text>{silenceDurationSeconds}s pause</Text>
                </View>

                <ClickableIcon
                    icon="plus-square-o"
                    clickCallback={() => {
                        setSilenceDuration(silenceDurationSeconds + 1)
                    }}
                ></ClickableIcon>

                {isPlaying && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsPlaying(false)
                        }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Image
                            source={img_pause}
                            style={{
                                width: SMALL_BUTTON_SIZE,
                                height: SMALL_BUTTON_SIZE,
                                tintColor: SMALL_BUTTON_TINT,
                            }}
                        />
                    </TouchableOpacity>
                )}
                {!isPlaying && (
                    <TouchableOpacity
                        onPress={() => {
                            // audioPlayer.playSound(() => {
                            //     // setPlayState('paused')
                            //     incrementPlayModeIndex()
                            // })
                            setIsPlaying(true)
                            // play()
                        }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Image
                            source={img_play}
                            style={{
                                width: SMALL_BUTTON_SIZE,
                                height: SMALL_BUTTON_SIZE,
                                tintColor: SMALL_BUTTON_TINT,
                            }}
                        />
                    </TouchableOpacity>
                )}

                <ClickableIcon
                    icon="chevron-left"
                    clickCallback={() => {
                        audioPlayer.jump(-JUMP_SECONDS)
                    }}
                ></ClickableIcon>

                <ClickableIcon
                    icon="chevron-right"
                    clickCallback={() => {
                        audioPlayer.jump(JUMP_SECONDS)
                    }}
                ></ClickableIcon>

                <Text style={{ alignSelf: 'center' }}>
                    {`${(Math.round(playSeconds * 10) / 10).toString()} / ${(
                        Math.round(duration * 10) / 10
                    ).toString()} s`}
                </Text>
            </View>
        </View>
    )
}

export default NewAudioPlayer
