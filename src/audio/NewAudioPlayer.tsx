import Sound from 'react-native-sound'

const PLAYER_INTERVAL_MS = 100
const DEBUG_PRINT = true

const debugLog = (message: string) => {
    if (DEBUG_PRINT) {
        console.log(message)
    }
}

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playState: 'playing' | 'playsilence' | 'paused' = 'paused'
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _silence: { duration: number } | null = null

    _playCompleteCallback: () => void = null

    setPlayCompleteCallback(playCompleteCallback: () => void) {
        this._playCompleteCallback = playCompleteCallback
    }

    init(
        timeCallback: (time: number) => void,
    ) {
        this._timeout = setInterval(() => {
            // console.log('[Audio player tick]', this._playState)
            if (
                this._playState == 'playing' &&
                this._sound != null &&
                this._sound.isLoaded()
            ) {
                this._sound.getCurrentTime((seconds, _isPlaying) => {
                    this._playSeconds = seconds
                    timeCallback(seconds)
                })
            } else if (
                this._playState == 'playsilence' &&
                this._silence != null
            ) {
                if (this._playSeconds < this._silence.duration) {
                    this._playSeconds += PLAYER_INTERVAL_MS / 1000
                    timeCallback(this._playSeconds)
                } else {
                    debugLog('[Audio player] silence completed')
                    this._silence = null
                    this._playCompleteCallback()
                }
            }
        }, PLAYER_INTERVAL_MS)
    }

    playSound() {
        // this._silence = null
        if (this._sound != null) {
            debugLog('[Audio player] play sound')
            this._sound.play(this._playCompleteCallback)
            this._playState = 'playing'
        } else {
            console.warn('Unknown state')
        }
    }

    playSilence(duration: number) {
        debugLog('[Audio player] playsilence')

        this._playSeconds = 0

        this._playState = 'playsilence'
        this._silence = {
            duration,
        }
    }

    jump(seconds: number) {
        debugLog('[Audio player] jump')
        this._playSeconds += seconds
    }

    pause() {
        debugLog('[Audio player] pause')
        if (this._sound != null) {
            this._sound.pause()
        }
        this._playState = 'paused'
    }

    unpause() {
        debugLog('[Audio player] unpause')
        if (this._sound != null) {
            this._sound.play(this._playCompleteCallback)
            this._playState = 'playing'
        } else if (this._silence != null) {
            this._playState = 'playsilence'
        } else {
            console.warn('Unknown state')
        }
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
        debugLog('[Audio player] loadaudio')

        if (this._sound != null && this._soundName == name) {
            successCallback(this._sound)
            return
        }

        this._soundName = name
        this._sound = new Sound(path, null, (error) => {
            if (error) {
                errorCallback(error)
            } else {
                successCallback(this._sound)
            }
        })
    }
}

export { NewAudioPlayerClass }
