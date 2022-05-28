import { VoiceId } from 'aws-sdk/clients/lexmodelsv2'
import Sound from 'react-native-sound'
import { Silence } from './silence'
import BackgroundTimer from 'react-native-background-timer'

const PLAYER_INTERVAL_MS = 200
const DEBUG_PRINT = true

const debugLog = (message: string) => {
    if (DEBUG_PRINT) {
        console.log(message)
    }
}

class NewAudioPlayerClass {
    _sound: Sound | null = null
    _silence: Silence | null = null

    // _duration: number = 0
    _playSoundOrSilence: 'sound' | 'silence' = null
    _isPlaying: boolean = false
    _playSeconds: number = 0
    _soundName: string = ''
    _timeout = null

    _playSpeed = 1

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
        timeCallback: (time: number) => void
    ) {
        // this._playSeconds = 0
        this._playSoundOrSilence = startSoundOrSilence
        BackgroundTimer.clearInterval(this._timeout)
        // clearInterval(this._timeout)
        this._timeout = BackgroundTimer.runBackgroundTimer(() => {
            // this._timeout = BackgroundTimer.setInterval(() => {

            timeCallback(this._playSeconds)

            if (!this._isPlaying) {
                return
            }
            // console.log('Tick')

            if (this._playSoundOrSilence == 'sound') {
                if (this._sound != null && this._sound.isLoaded()) {
                    this._sound.getCurrentTime((seconds, _isPlaying) => {
                        console.log('!!! sound seconds:', seconds)
                        this._playSeconds = seconds
                    })
                } else {
                    console.log('!!! loading')
                }
            } else {
                if (this._silence.isPlaying()) {
                    this._silence.update()
                    this._playSeconds = this._silence.getCurrentTime() / 1000
                    console.log('!!! silence seconds:', this._playSeconds)
                }
            }
        }, PLAYER_INTERVAL_MS)
    }

    getSoundDuration(): number {
        return this._sound.getDuration()
    }

    playSound() {
        console.log('>>> Assigning new sound')
        if (this._sound != null) {
            debugLog('[Audio player] play sound')
            this._sound.play(() => {
                this._playCompleteCallback()
            })
            this._sound.setSpeed(this._playSpeed)
        } else {
            console.warn('Unknown state')
        }
    }

    playSilence(silenceDuration: number) {
        debugLog('[Audio player] playsilence')

        // if (this._silence != null) {
        //     this._silence.detach()
        // }

        // this._playSeconds = 0
        this._silence = new Silence(silenceDuration)
        this._silence.play(() => {
            console.log('Play complete callback!')
            this._playCompleteCallback()
        })
        this._isPlaying = true
        this._playSoundOrSilence = 'silence'
    }

    changeSilenceDuration(newDuration: number) {
        if (this._silence != null) {
            this._silence._duration = newDuration
        }
    }

    jump(seconds: number) {
        this._playSeconds += seconds
        if (this._playSoundOrSilence == 'sound') {
            this._sound.setCurrentTime(this._playSeconds + seconds)
        }
        //  else {
        //     this._silence.setCurrentTime(this._playSeconds + seconds)
        // }
    }

    pause() {
        debugLog(
            '[Audio player] pause, has sound: ' +
                (this._sound != null).toString()
        )
        if (this._sound != null) {
            this._sound.pause()
        }
        if (this._silence != null) {
            this._silence.pause()
        }
        this._isPlaying = false
    }

    unpause() {
        this._isPlaying = true
        console.log('sound or silence', this._playSoundOrSilence)
        if (this._playSoundOrSilence == 'sound') {
            console.log('Playing sound')
            this._sound.play(() => {
                this._playCompleteCallback()
                this._playSeconds = 0
                this._sound.pause()
            })
            this._sound.setSpeed(this._playSpeed)
            console.log('-- in unpause')
        } else {
            this._silence.play(() => {
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
        if (this._playSoundOrSilence == 'sound' && this._sound != null) {
            this._sound.setCurrentTime(this._playSeconds)
        }
        //  else if (this._playSoundOrSilence == 'silence') {
        //     this._silence.setCurrentTime(this._playSeconds)
        // }
    }

    detach() {
        clearInterval(this._timeout)
        // if (this._silence != null) {
        //     this._silence.detach()
        // }
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
