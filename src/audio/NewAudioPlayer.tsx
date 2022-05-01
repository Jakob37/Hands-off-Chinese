import Sound from 'react-native-sound'

const PLAYER_INTERVAL_MS = 100
const DEBUG_PRINT = false

const debugLog = (message: string) => {
    if (DEBUG_PRINT) {
        console.log(message)
    }
}

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _duration: number = 0
    _playSoundOrSilence: 'sound' | 'silence' = null
    _isPlaying: boolean = false
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _silence: { duration: number } | null = null

    _playCompleteCallback: () => void = null

    setPlayCompleteCallback(
        playCompleteCallback: () => void,
        resetTime: boolean,
        playMode: string | null
    ) {
        if (resetTime) {
            this._playSeconds = 0
        }
        if (playMode != null) {
            this._playSoundOrSilence = playMode as 'sound' | 'silence'
        }
        this._playCompleteCallback = playCompleteCallback
    }

    init(
        startSoundOrSilence: 'sound' | 'silence',
        timeCallback: (time: number) => void,
        silenceDuration: number
    ) {
        // this._playSeconds = 0
        this._playSoundOrSilence = startSoundOrSilence
        this._silence = {
            duration: silenceDuration,
        }
        clearInterval(this._timeout)
        this._timeout = setInterval(() => {
            // console.log('[Audio player tick]', this._silence.duration, 'play seconds', this._playSeconds)

            timeCallback(this._playSeconds)

            if (!this._isPlaying) {
                return
            }

            if (this._playSoundOrSilence == 'sound') {
                if (this._sound != null && this._sound.isLoaded()) {
                    this._sound.getCurrentTime((seconds, _isPlaying) => {
                        console.log('!!! sound seconds:', seconds)
                        this._playSeconds = seconds
                    })
                } else {
                    console.log('!!! loading')
                }
            } else if (this._playSoundOrSilence == 'silence') {
                if (this._playSeconds < this._silence.duration) {
                    this._playSeconds += PLAYER_INTERVAL_MS / 1000
                    console.log(
                        '--- silence duration',
                        this._playSeconds,
                        '/',
                        Math.round(this._silence.duration * 10) / 10
                    )
                } else {
                    debugLog('[Audio player] silence completed')
                    console.log('--- silence done')
                    this._playSeconds = 0
                    // this._silence = null
                    this._playCompleteCallback()
                }
            } else {
                console.log(
                    '::: Skipping, mode',
                    this._playSoundOrSilence,
                    'has sound',
                    this._sound != null,
                    'sound loaded',
                    this._sound.isLoaded()
                )
            }
        }, PLAYER_INTERVAL_MS)
    }

    playSound() {
        // this._isPlaying = true
        console.log('>>> Assigning new sound')
        // this._playSoundOrSilence = 'sound'
        if (this._sound != null) {
            debugLog('[Audio player] play sound')
            this._sound.play(() => {
                this._playCompleteCallback()
                this._playSeconds = 0
            })
        } else {
            console.warn('Unknown state')
        }
    }

    playSilence() {
        debugLog('[Audio player] playsilence')

        this._playSeconds = 0
        this._isPlaying = true
        this._playSoundOrSilence = 'silence'
    }

    jump(seconds: number) {
        debugLog('[Audio player] jump')
        this._playSeconds += seconds
    }

    pause() {
        debugLog(
            '[Audio player] pause, has sound: ' +
                (this._sound != null).toString()
        )
        if (this._sound != null) {
            this._sound.pause()
        }
        this._isPlaying = false
    }

    unpause() {
        this._isPlaying = true
        console.log('sound or silence', this._playSoundOrSilence)
        if (this._sound != null && this._playSoundOrSilence == 'sound') {
            console.log('Playing sound')
            this._sound.play(() => {
                this._playCompleteCallback()
                this._playSeconds = 0
            })
        }
        debugLog(
            '[Audio player] unpause to play state: ' +
                this._isPlaying +
                ' playOrSilence ' +
                this._playSoundOrSilence
        )
    }

    setCurrentTime(seconds: number) {
        this._playSeconds = seconds
        // if (this._sound != null) {
        // } else {
        //     this._playSeconds = 0
        // }
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
