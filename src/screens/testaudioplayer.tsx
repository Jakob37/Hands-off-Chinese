import React, { useEffect, useState } from 'react'
import {
    View,
    Image,
    Text,
    Slider,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native'

import Sound from 'react-native-sound'
import { getSignedUrl } from '../views/card/util'
import { TestAudioPlayerProps } from './navigationutils'

const img_speaker = require('../../resources/ui_speaker.png')
const img_pause = require('../../resources/ui_pause.png')
const img_play = require('../../resources/ui_play.png')
const img_playjumpleft = require('../../resources/ui_playjumpleft.png')
const img_playjumpright = require('../../resources/ui_playjumpright.png')
const test_mp3 = require('../../resources/file_example.mp3')

const PLAYER_INTERVAL = 100
const JUMP_SECONDS = 15
const SMALL_BUTTON_SIZE = 30
const SPEAKER_SIZE = 150
const SMALL_BUTTON_TINT = 'gray'

function PlayerScreen({ route, navigation }: TestAudioPlayerProps) {
    const [playState, setPlayState] = useState('paused')
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [sliderEditing, setSliderEditing] = useState(false)
    const [sound, setSound] = useState(null)
    const [soundName, setSoundName] = useState('')
    // const [timeout, setTimeout] = useState(null)

    let timeout = null

    useEffect(() => {
        timeout = setInterval(() => {
            if (
                sound != null &&
                sound.isLoaded() &&
                playState == 'playing' &&
                !sliderEditing
            ) {
                sound.getCurrentTime((seconds, _isPlaying) => {
                    setPlaySeconds(seconds)
                })
            }
        }, PLAYER_INTERVAL)

        return () => {
            if (timeout != null) {
                clearInterval(timeout)
            }
        }
    }, [sound, playState])

    // Clear sound when unmounting component
    useEffect(() => {
        // Used to pre-load? But doesn't start playing?
        doPlay()

        return () => {
            if (sound != null) {
                sound.release()
                setSound(null)
                setSoundName('')
            }
        }
    }, [])

    const onSliderEditing = (seconds: number) => {
        if (sound != null) {
            sound.setCurrentTime(seconds)
            setPlaySeconds(seconds)
        }
    }

    const doPlay = async () => {
        // console.log('Entering doPlay')
        if (sound != null) {
            sound.play(playComplete)
            setPlayState('playing')
        } else {
            const user = route.params.audioEntries[0].user
            const id = route.params.audioEntries[0].chineseKey
            const key = `${user}/${id}`
            const signedUrl = await getSignedUrl(key)

            console.log('Obtained signed URL', signedUrl)

            // const filepath = test_mp3
            const newSound = new Sound(signedUrl, null, (error) => {
                console.log('Sound callback called')
                if (error) {
                    console.log('failed to load the sound', error)
                    Alert.alert('Notice', 'audio file error. (Error code : 1)')
                    setPlayState('paused')
                } else {
                    console.log('------ Successful load')
                    setDuration(newSound.getDuration())
                }
            })

            setSound(newSound)
            setSoundName(key)
        }
    }
    const playComplete = (success: boolean) => {
        if (sound) {
            if (success) {
                console.log('successfully finished playing')
            } else {
                console.log('playback failed due to audio decoding errors')
                Alert.alert('Notice', 'audio file error. (Error code : 2)')
            }
            setPlayState('paused')
            setPlaySeconds(0)
            sound.setCurrentTime(0)
        }
    }

    const doPause = () => {
        if (sound != null) {
            sound.pause()
        }
        setPlayState('paused')
    }

    const jumpSeconds = (secsDelta: number) => {
        if (sound != null) {
            sound.getCurrentTime((secs: number, isPlaying: boolean) => {
                let nextSecs = secs + secsDelta
                if (nextSecs < 0) nextSecs = 0
                else if (nextSecs > duration) nextSecs = duration
                sound.setCurrentTime(nextSecs)
                setPlaySeconds(nextSecs)
            })
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >
            <Image
                source={img_speaker}
                style={{
                    width: SPEAKER_SIZE,
                    height: SPEAKER_SIZE,
                    marginBottom: 15,
                    alignSelf: 'center',
                }}
            />
            <Text style={{ alignSelf: 'center' }}>Loaded: {soundName}</Text>
            <Text style={{ alignSelf: 'center' }}>Play state: {playState}</Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        jumpSeconds(-JUMP_SECONDS)
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
                        onPress={doPause}
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
                        onPress={doPlay}
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
                        jumpSeconds(JUMP_SECONDS)
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
        </View>
    )
}

export default PlayerScreen
