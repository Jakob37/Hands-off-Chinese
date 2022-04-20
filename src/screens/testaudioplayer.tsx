import React, { useEffect, useState } from 'react'
import {
    View,
    Image,
    Text,
    Slider,
    TouchableOpacity,
    Platform,
} from 'react-native'

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

// TP: Could these modes be used as a source here?
const PLAYER_MODES = {
    english_chinese: ['english', 'chinese'],
    chinese_only: ['chinese', 'pause'],
    chinese_english: ['chinese', 'pause', 'english', 'pause'],
} as Record<string, ('english' | 'chinese' | 'pause')[]>

const audioPlayer = new NewAudioPlayerClass()

interface NewAudioPlayerProps {
    audioEntries: AudioEntryPair[]
}
function NewAudioPlayer(props: NewAudioPlayerProps) {
    const [playModes, setPlayModes] = useState<
        ('english' | 'chinese' | 'pause')[]
    >(PLAYER_MODES.english_chinese)
    const [playAudioIndices, setPlayAudioIndices] = useState({
        play: 0,
        audio: 0,
    })
    // const [audioEntryIndex, setAudioEntryIndex] = useState(0)
    const [playState, setPlayState] = useState<'paused' | 'playing'>('paused')
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [soundName, setSoundName] = useState('')

    const incrementPlayModeIndex = () => {
        let playIndex = playAudioIndices.play + 1
        let entryIndex = playAudioIndices.audio
        if (playIndex >= playModes.length) {
            playIndex -= playModes.length
            entryIndex = (entryIndex + 1) % props.audioEntries.length
        }

        console.log('Play index', playIndex, 'Entry index', entryIndex)

        setPlayAudioIndices({ play: playIndex, audio: entryIndex })
        // setAudioEntryIndex(entryIndex)
    }

    useEffect(() => {
        audioPlayer.init((time) => {
            setPlaySeconds(time)
        })

        return () => {
            audioPlayer.detach()
        }
    }, [playState, props.audioEntries])

    useEffect(() => {
        loadSound()

        return () => {
            audioPlayer.detach()
            setSoundName('')
        }
    }, [props.audioEntries])

    useEffect(() => {
        loadSound()
    }, [playAudioIndices])

    const loadSound = async () => {
        console.assert(props.audioEntries.length > 0)

        const playingLanguage = playModes[playAudioIndices.play]

        console.log(
            '--- Loading language',
            playAudioIndices,
        )

        const currAudioEntry = props.audioEntries[playAudioIndices.audio]

        const user = currAudioEntry.user
        const id =
            playingLanguage == 'chinese'
                ? currAudioEntry.chineseKey
                : currAudioEntry.englishKey
        const key = `${user}/${id}`
        const url = await getSignedUrl(key)
        audioPlayer.loadAudio(
            url,
            key,
            (error) => {
                console.log('failed to load the sound', error)
                setPlayState('paused')
            },
            (sound) => {
                console.log('------ Successful load')
                setDuration(sound.getDuration())
            }
        )

        setSoundName(key)
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
                    marginVertical: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        audioPlayer.jump(-JUMP_SECONDS)
                    }}
                    style={{ justifyContent: 'center' }}
                >
                    <Image
                        source={img_playjumpleft}
                        style={{
                            width: SMALL_BUTTON_SIZE,
                            height: SMALL_BUTTON_SIZE,
                            tintColor: 'gray',
                        }}
                    />
                    <Text
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: 1,
                            fontSize: 12,
                        }}
                    >
                        15
                    </Text>
                </TouchableOpacity>

                {playState == 'playing' && (
                    <TouchableOpacity
                        onPress={() => {
                            audioPlayer.pause()
                            setPlayState('paused')
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
                {playState == 'paused' && (
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Pressing')
                            audioPlayer.play(() => {
                                setPlayState('paused')
                                incrementPlayModeIndex()
                            })
                            setPlayState('playing')
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
                <TouchableOpacity
                    onPress={() => {
                        audioPlayer.jump(JUMP_SECONDS)
                    }}
                    style={{ justifyContent: 'center' }}
                >
                    <Image
                        source={img_playjumpright}
                        style={{
                            width: SMALL_BUTTON_SIZE,
                            height: SMALL_BUTTON_SIZE,
                            tintColor: SMALL_BUTTON_TINT,
                        }}
                    />
                    <Text
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: 1,
                            // color: 'white',
                            fontSize: 12,
                        }}
                    >
                        15
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Slider */}

            <View
                style={{
                    marginVertical: 15,
                    marginHorizontal: 15,
                    flexDirection: 'row',
                }}
            >
                <Text style={{ alignSelf: 'center' }}>
                    {`${Math.round(playSeconds).toString()} s`}
                </Text>
                <Slider
                    onTouchStart={() => {
                        // setSliderEditing(true)
                        audioPlayer.pause()
                    }}
                    // onTouchMove={() => console.log('onTouchMove')}
                    onTouchEnd={() => {
                        // setSliderEditing(false)
                        audioPlayer.unpause()
                    }}
                    // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                    // onTouchCancel={() => console.log('onTouchCancel')}
                    onValueChange={(seconds) => {
                        audioPlayer.setCurrentTime(seconds)
                        setPlaySeconds(audioPlayer._playSeconds)
                    }}
                    value={playSeconds}
                    maximumValue={duration}
                    maximumTrackTintColor="gray"
                    minimumTrackTintColor="white"
                    thumbTintColor="white"
                    style={{
                        flex: 1,
                        alignSelf: 'center',
                        marginHorizontal: Platform.select({ ios: 5 }),
                    }}
                />
                <Text style={{ alignSelf: 'center' }}>{`${Math.round(
                    duration
                ).toString()} s`}</Text>
            </View>
            <Text style={{ alignSelf: 'flex-start' }}>Loaded: {soundName}</Text>
            <Text style={{ alignSelf: 'flex-start' }}>
                Play state: {playState} {playAudioIndices.play} Language: {playAudioIndices.audio}
            </Text>
        </View>
    )
}

export default NewAudioPlayer
