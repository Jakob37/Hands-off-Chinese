import Sound from 'react-native-sound'

const PLAYER_INTERVAL = 100

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playState: 'playing' | 'playsilence' | 'paused' = 'paused'
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _silenceStart = null
    _silenceDuration = null

    _playCompleteCallback: () => void = null

    constructor() {
        console.log('New constructor')
    }

    play(playCompleteCallback: () => void) {
        this._playCompleteCallback = playCompleteCallback
        if (this._sound != null) {
            this._sound.play(playCompleteCallback)
            this._playState = 'playing'
        } else if (this._currentlyPlayingSilence()) {
            this._playState = 'playsilence'
        } else {
            console.warn('Unknown state')
        }
    }

    playSilence(durationSeconds: number, playCompleteCallback: () => void) {
        console.log('Calling play silence')
        this._playState = 'playsilence'
        this._silenceStart = new Date().getSeconds()
        this._silenceDuration = durationSeconds
        this._playCompleteCallback = playCompleteCallback
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

    _currentlyPlayingSilence(): boolean {
        const currTime = new Date().getSeconds()

        return (
            this._playState == 'playsilence' &&
            currTime > this._silenceStart &&
            currTime <= this._silenceStart + this._silenceDuration
        )
    }

    init(timeCallback: (time: number) => void) {
        this._timeout = setInterval(() => {
            if (
                this._playState == 'playing' &&
                this._sound != null &&
                this._sound.isLoaded()
            ) {
                this._sound.getCurrentTime((seconds, _isPlaying) => {
                    this._playSeconds = seconds
                    timeCallback(seconds)
                })
            } else if (this._currentlyPlayingSilence()) {
                const currTime = new Date().getSeconds()

                const durationExpired =
                    currTime >= this._silenceStart + this._silenceDuration

                console.log(
                    'Curr',
                    currTime,
                    'end',
                    this._silenceStart + this._silenceDuration
                )

                if (!durationExpired) {
                    this._playSeconds = currTime - this._silenceStart
                    timeCallback(this._playSeconds)
                } else {
                    console.log('Pause completed')
                    this._playCompleteCallback()
                }
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
        this._soundName = name

        this._sound = new Sound(path, null, (error) => {
            if (error) {
                errorCallback(error)
            } else {
                successCallback(this._sound)
            }
        })
    }

    setPause(duration) {
        this._duration = duration
        this._soundName = 'Paus'
    }
}

export { NewAudioPlayerClass }
