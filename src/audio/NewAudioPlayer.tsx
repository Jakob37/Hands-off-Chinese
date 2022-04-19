import Sound from 'react-native-sound'

const PLAYER_INTERVAL = 100

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playState: 'playing' | 'paused' = 'paused'
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _playCompleteCallback: () => void = null

    constructor() {
        console.log('New constructor')
    }

    play(playCompleteCallback: () => void) {
        // console.log('Attempting play, with _sound', this._sound)
        if (this._sound != null) {
            this._playCompleteCallback = playCompleteCallback
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

    unpause() {
        if (this._sound != null) {
            this._sound.play(this._playCompleteCallback)
            this._playState = 'playing'
        }
    }

    init(timeCallback: (time: number) => void) {
        console.log(': Running init')
        this._timeout = setInterval(() => {
            if (
                this._sound != null &&
                this._sound.isLoaded() &&
                this._playState == 'playing'
            ) {
                this._sound.getCurrentTime((seconds, _isPlaying) => {
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
