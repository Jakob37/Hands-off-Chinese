import Sound from 'react-native-sound'
import { playTestSound } from 'src/test/util'

const PLAYER_INTERVAL = 1000

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playState: 'playing' | 'paused' = 'paused'
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    constructor() {
        console.log('New constructor')
    }

    play(playCompleteCallback: () => void) {
        // console.log('Attempting play, with _sound', this._sound)
        if (this._sound != null) {
            console.log('Play audio')
            this._sound.play(playCompleteCallback)
            this._playState = 'playing'
        }
    }

    jump(seconds: number) {
        this._playSeconds += seconds
    }

    pause() {
        if (this._sound != null) {
            this._sound.pause()
        }
        this._playState = 'paused'
    }

    init(timeCallback: (time: number) => void) {
        console.log(': Running init')
        this._timeout = setInterval(() => {
            console.log(
                ': Tick, with audio:',
                this._sound != null,
                'Play state',
                this._playState
            )
            if (
                this._sound != null &&
                this._sound.isLoaded() &&
                this._playState == 'playing'
            ) {
                console.log(': Playing')
                this._sound.getCurrentTime((seconds, _isPlaying) => {
                    console.log(': Retrieving current time', seconds)
                    this._playSeconds = seconds
                    timeCallback(seconds)
                })
            }
        }, PLAYER_INTERVAL)
    }

    setCurrentTime(seconds: number) {
        if (this._sound != null) {
            this._playSeconds = seconds
        } else {
            this._playSeconds = 0
        }
    }

    detach() {
        clearInterval(this._timeout)
    }

    loadAudio(
        path: string,
        name: string,
        errorCallback: (error: string) => void,
        successCallback: (sound: Sound) => void
    ) {
        console.log('Loading audio')
        this._soundName = name

        this._sound = new Sound(path, null, (error) => {
            console.log('Sound callback called')
            if (error) {
                errorCallback(error)
            } else {
                successCallback(this._sound)
            }
        })
        console.log('Sound not null:', this._sound != null)
    }

    setPause(duration) {
        this._duration = duration
        this._soundName = 'Paus'
    }
}

export { NewAudioPlayerClass }
