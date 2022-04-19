import React, { useEffect, useState } from 'react'
import {
    View,
    Image,
    Text,
    Slider,
    TouchableOpacity,
    Platform,
} from 'react-native'

import Sound from 'react-native-sound'
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
    english_chinese: ['english', 'pause', 'chinese', 'pause'],
    chinese_only: ['chinese', 'pause'],
    chinese_english: ['chinese', 'pause', 'english', 'pause'],
}

const audioPlayer = new NewAudioPlayerClass()

interface NewAudioPlayerProps {
    audioEntry: AudioEntryPair
}
function NewAudioPlayer(props: NewAudioPlayerProps) {
    const [playingLanguage, setPlayingLanguage] =
        useState<'english' | 'chinese'>('english')
    const [playState, setPlayState] = useState<'paused' | 'playing'>('paused')
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [sliderEditing, setSliderEditing] = useState(false)
    const [soundName, setSoundName] = useState('')

    useEffect(() => {
        audioPlayer.init((time) => {
            setPlaySeconds(time)
        })

        return () => {
            audioPlayer.detach()
        }
    }, [playState, props.audioEntry])

    useEffect(() => {
        loadSound()

        return () => {
            audioPlayer.detach()
            setSoundName('')
        }
    }, [props.audioEntry])

    const onSliderEditing = (seconds: number) => {
        audioPlayer.setCurrentTime(seconds)
        setPlaySeconds(audioPlayer._playSeconds)
        // if (sound != null) {
        //     sound.setCurrentTime(seconds)
        //     setPlaySeconds(seconds)
        // }
    }

    const loadSound = async () => {
        console.assert(props.audioEntry != null)

        const user = props.audioEntry.user
        const id =
            playingLanguage == 'chinese'
                ? props.audioEntry.chineseKey
                : props.audioEntry.englishKey
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

        // setSound(newSound)
        setSoundName(key)
    }

    // const playComplete = (success: boolean) => {
    //     // console.assert(sound != null)

    //     if (success) {
    //         console.log('successfully finished playing')
    //     } else {
    //         console.log('playback failed due to audio decoding errors')
    //         Alert.alert('Notice', 'audio file error. (Error code : 2)')
    //     }
    //     setPlayState('paused')
    //     if (playingLanguage == 'english') {
    //         setPlayingLanguage('chinese')
    //     } else {
    //         setPlayingLanguage('english')
    //     }

    //     // setSound(null)
    //     setPlaySeconds(0)
    //     sound.setCurrentTime(0)
    //     loadSound()
    // }

    // const jumpSeconds = (secsDelta: number) => {
    //     if (sound != null) {
    //         sound.getCurrentTime((secs: number, isPlaying: boolean) => {
    //             let nextSecs = secs + secsDelta
    //             if (nextSecs < 0) nextSecs = 0
    //             else if (nextSecs > duration) nextSecs = duration
    //             sound.setCurrentTime(nextSecs)
    //             setPlaySeconds(nextSecs)
    //         })
    //     }
    // }

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
                        setSliderEditing(true)
                    }}
                    onTouchMove={() => console.log('onTouchMove')}
                    onTouchEnd={() => {
                        setSliderEditing(false)
                    }}
                    onTouchEndCapture={() => console.log('onTouchEndCapture')}
                    onTouchCancel={() => console.log('onTouchCancel')}
                    onValueChange={onSliderEditing}
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
                Play state: {playState} Language: {playingLanguage}
            </Text>
        </View>
    )
}

export default NewAudioPlayer
