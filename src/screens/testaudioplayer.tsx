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

const img_speaker = require('../../resources/ui_speaker.png')
const img_pause = require('../../resources/ui_pause.png')
const img_play = require('../../resources/ui_play.png')
const img_playjumpleft = require('../../resources/ui_playjumpleft.png')
const img_playjumpright = require('../../resources/ui_playjumpright.png')
const test_mp3 = require('../../resources/file_example.mp3')

const PLAYER_INTERVAL = 100
const JUMP_SECONDS = 15
const SMALL_BUTTON_SIZE = 30
const SMALL_BUTTON_TINT = 'gray'

function PlayerScreen({ route, navigation }) {
    // sound: Sound | null
    // sliderEditing: boolean
    // timeout: any
    // playSeconds: number

    const [playState, setPlayState] = useState('paused')
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [sliderEditing, setSliderEditing] = useState(false)
    const [sound, setSound] = useState(null)
    const [soundName, setSoundName] = useState('')
    // const [timeout, setTimeout] = useState(null)

    let timeout = null

    useEffect(() => {
        // doPlay()
        // doPause()
        console.log('Play effect')

        timeout = setInterval(() => {
            console.log(
                '--- Sound:',
                sound != null,
                'Sound loaded',
                sound != null ? sound.isLoaded() : null,
                'Play state',
                playState
            )
            if (
                sound != null &&
                sound.isLoaded() &&
                playState == 'playing' &&
                !sliderEditing
            ) {
                console.log('Updating current time')
                sound.getCurrentTime((seconds, isPlaying) => {
                    // setState({ playSeconds: seconds })
                    console.log('Received seconds:', seconds)
                    setPlaySeconds(seconds)
                })
            }
        }, PLAYER_INTERVAL * 20)

        return () => {
            if (timeout != null) {
                clearInterval(timeout)
            }
        }

        // Call on unmount?
        // https://stackoverflow.com/questions/53464595/how-to-use-componentwillmount-in-react-hooks
    }, [sound, playState])

    useEffect(() => {
        return () => {
            console.log('Unmounting component')
            if (sound != null) {
                sound.release()
                setSound(null)
                setSoundName('')
            }
            // if (timeout != null) {
            //     clearInterval(timeout)
            // }
        }
    }, [])

    // static navigationOptions = (props) => ({
    //     title: props.navigation.state.params.title,
    // })

    // constructor() {
    //     super()
    //     this.state = {
    //         playState: 'paused', //playing, paused
    //         playSeconds: 0,
    //         duration: 0,
    //     }
    //     this.sliderEditing = false
    // }

    // componentDidMount() {
    //     this.play()

    //     this.timeout = setInterval(() => {
    //         if (
    //             this.sound &&
    //             this.sound.isLoaded() &&
    //             this.state.playState == 'playing' &&
    //             !this.sliderEditing
    //         ) {
    //             this.sound.getCurrentTime((seconds, isPlaying) => {
    //                 this.setState({ playSeconds: seconds })
    //             })
    //         }
    //     }, 100)
    // }
    // componentWillUnmount() {
    //     if (this.sound) {
    //         this.sound.release()
    //         this.sound = null
    //     }
    //     if (this.timeout) {
    //         clearInterval(this.timeout)
    //     }
    // }

    const onSliderEditStart = () => {
        setSliderEditing(true)
    }
    const onSliderEditEnd = () => {
        setSliderEditing(false)
    }
    const onSliderEditing = (seconds: number) => {
        if (sound != null) {
            sound.setCurrentTime(seconds)
            setPlaySeconds(seconds)
            // this.setState({ playSeconds: value })
        }
    }

    const doPlay = async () => {
        console.log('Calling play with sound file', sound)

        if (sound != null) {
            sound.play(playComplete)
            setPlayState('playing')
        } else {
            // const filepath = this.props.navigation.state.params.filepath
            // var dirpath = ''
            // if (this.props.navigation.state.params.dirpath) {
            //     dirpath = this.props.navigation.state.params.dirpath
            // }
            const filepath = test_mp3
            console.log('[Play]', filepath)

            const newSound = new Sound(filepath, (error) => {
                console.log('Sound callback called')
                if (error) {
                    console.log('failed to load the sound', error)
                    Alert.alert('Notice', 'audio file error. (Error code : 1)')
                    setPlayState('paused')
                    // this.setState({ playState: 'paused' })
                } else {
                    // this.setState({
                    //     playState: 'playing',
                    //     duration: this.sound.getDuration(),
                    // })
                    console.log('------ Successful load')
                    setDuration(newSound.getDuration())
                    // sound.play(playComplete)
                }
            })

            setSound(newSound)
            setSoundName(filepath)
        }
    }
    const playComplete = (success) => {
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

    // const jumpPrev15Seconds = () => {
    //     this.jumpSeconds(-15)
    // }
    // const jumpNext15Seconds = () => {
    //     this.jumpSeconds(15)
    // }
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

    // const getAudioTimeString = (seconds: number): string => {
    //     // const h = seconds / (60 * 60)
    //     // const m = (seconds % (60 * 60)) / 60
    //     const s = Math.round(seconds)

    //     // const returnStr =
    //     //     (h < 10 ? '0' + h : h) +
    //     //     ':' +
    //     //     (m < 10 ? '0' + m : m) +
    //     //     ':' +
    //     //     (s < 10 ? '0' + s : s)
    //     return `${s} s`
    // }

    const currentTimeString = (): string => {
        return `${Math.round(playSeconds).toString()} s`
    }

    const durationString = (): string => {
        return `${Math.round(duration).toString()} s`
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                // backgroundColor: 'black',
            }}
        >
            <Image
                source={img_speaker}
                style={{
                    width: 150,
                    height: 150,
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
                    {currentTimeString()}
                </Text>
                <Slider
                    onTouchStart={onSliderEditStart}
                    onTouchMove={() => console.log('onTouchMove')}
                    onTouchEnd={onSliderEditEnd}
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
                <Text style={{ alignSelf: 'center' }}>{durationString()}</Text>
            </View>
        </View>
    )
}

export default PlayerScreen
