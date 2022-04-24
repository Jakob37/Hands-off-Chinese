import Sound from 'react-native-sound'

const PLAYER_INTERVAL_MS = 100
const DEBUG_PRINT = true

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playState: 'playing' | 'playsilence' | 'paused' = 'paused'
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _silence: { duration: number } | null = null

    _playCompleteCallback: () => void = null

    playSound(playCompleteCallback: () => void) {
        this._playCompleteCallback = playCompleteCallback
        // this._silence = null
        if (this._sound != null) {
            if (DEBUG_PRINT) {
                console.log('[Audio player] play sound')
            }
            this._sound.play(playCompleteCallback)
            this._playState = 'playing'
        } else {
            console.warn('Unknown state')
        }
    }

    playSilence(duration: number, playCompleteCallback: () => void) {
        if (DEBUG_PRINT) {
            console.log('[Audio player] playsilence')
        }

        // this._sound = null
        this._playSeconds = 0

        this._playState = 'playsilence'
        this._silence = {
            duration,
        }
        this._playCompleteCallback = playCompleteCallback
    }

    jump(seconds: number) {
        if (DEBUG_PRINT) {
            console.log('[Audio player] jump')
        }
        this._playSeconds += seconds
    }

    pause() {
        if (DEBUG_PRINT) {
            console.log('[Audio player] pause')
            console.log(
                '--- sound:',
                this._sound != null,
                'paused',
                this._silence
            )
        }
        if (this._sound != null) {
            this._sound.pause()
        }
        this._playState = 'paused'
    }

    unpause() {
        if (DEBUG_PRINT) {
            console.log('[Audio player] unpause')
        }
        if (this._sound != null) {
            this._sound.play(this._playCompleteCallback)
            this._playState = 'playing'
        } else if (this._silence != null) {
            this._playState = 'playsilence'
        } else {
            console.warn('Unknown state')
        }
    }

    init(timeCallback: (time: number) => void) {
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
                    this._silence = null
                    this._playCompleteCallback()
                }
            }
        }, PLAYER_INTERVAL_MS)
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
        if (DEBUG_PRINT) {
            console.log('[Audio player] loadaudio')
        }

        if (this._sound != null && this._soundName == name) {
            successCallback(this._sound)
            return;
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
