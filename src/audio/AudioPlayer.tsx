import { default as Sound } from 'react-native-sound'
// import { playAudio } from "../views/card/audiocard"
// import { audioLibraries } from "./Database";
import { getRandomFromArray } from '../util/util'
import { AudioEntryPair } from '../backend/audioentry'
import { HocDb } from '../backend/database'
import { playAudio } from '../views/card/util'

Sound.setCategory('Playback')

const AudioState = Object.freeze({
    stopped: 0,
    playing_english: 1,
    english_pause: 2,
    playing_chinese: 3,
    chinese_pause: 4,
})

class AudioPlayer {
    allAudioPairs: AudioEntryPair[] = []
    db: HocDb
    user: string

    getActiveAudioPairs(): AudioEntryPair[] {
        const activeAudioPairs = []
        // console.log('All audio pairs', this.allAudioPairs)
        for (const audioPair of this.allAudioPairs) {
            // console.log('FIXME: All active for now')
            // console.log(audioPair)
            // if (this.db.getIsActive(audioPair.id)) {
            activeAudioPairs.push(audioPair)
            // }
        }
        return activeAudioPairs
    }

    audioState: number = AudioState.stopped
    currentlyPlayingPair: AudioEntryPair | null = null
    delay: number = 4000

    startTime: number = 0
    getTimeSinceStart(): number {
        return (new Date().getTime() - this.startTime) / 1000
    }

    isPlaying: boolean = false

    counter: number = 0
    timerHook: (value: number) => void
    addTimerHook(timerHook: (value: number) => void) {
        this.timerHook = timerHook
    }
    interval: NodeJS.Timer

    getState(): string {
        return Object.keys(AudioState)[this.audioState]
    }

    load(user: string, audioEntries: AudioEntryPair[], db: HocDb) {
        this.user = user
        this.allAudioPairs = audioEntries
        this.db = db
    }

    incrementDelay() {
        this.delay += 1000
    }

    reduceDelay() {
        this.delay -= 1000
    }

    setDelay(delay: number) {
        this.delay = delay
    }

    playRandom() {
        const audioEntry = getRandomFromArray(this.getActiveAudioPairs())
        this.currentlyPlayingPair = audioEntry
        playAudio(audioEntry.englishKey, this.user, () => {
            this.playEvent()
        })
    }

    playPause(duration: number) {
        setTimeout(() => {
            this.playEvent()
        }, duration)
    }

    getNumberClips(): number {
        return this.allAudioPairs.length
    }

    getNumberActiveClips(): number {
        return this.getActiveAudioPairs().length
    }

    // lastDuration: number
    durationHook: (duration: number) => void
    addDurationHook(durationHook: (duration: number) => void) {
        this.durationHook = durationHook
    }

    playEvent() {
        if (!this.isPlaying) {
            return
        }

        if (this.getNumberActiveClips() == 0) {
            this.stop()
            return
        }

        console.log('Playing with state', this.audioState)

        if (this.audioState == AudioState.playing_english) {
            this.playRandom()
            this.audioState = AudioState.english_pause
        } else if (this.audioState == AudioState.english_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_chinese
        } else if (this.audioState == AudioState.playing_chinese) {
            const currAudio = this.currentlyPlayingPair
            playAudio(currAudio.chineseKey, this.user, (sound: Sound) => {
                this.playEvent()
                this.durationHook(Math.round(sound.getDuration()))
            })
            this.audioState = AudioState.chinese_pause
        } else if (this.audioState == AudioState.chinese_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_english
        } else {
            console.warn('Unknown situation for audio state:', this.audioState)
        }
    }

    play() {
        this.startTime = new Date().getTime()
        this.audioState = AudioState.playing_english
        this.isPlaying = true
        this.playEvent()

        const timerStep = 100
        this.interval = setInterval(() => {
            this.counter += 0.1
            this.timerHook(Math.round(this.counter * 10) / 10)
        }, timerStep)
    }

    stop() {
        this.audioState = AudioState.stopped
        this.isPlaying = false
        clearInterval(this.interval)
    }

    pauseAll() {
        this.allAudioPairs.map((audioPair) => (audioPair.paused = true))
    }
}

async function playSound(
    soundPath: string,
    setDuration: (duration: number) => void
) {
    const appleSound = await new Sound(
        soundPath,
        Sound.MAIN_BUNDLE,
        (error) => {
            if (error) {
                console.warn(
                    'failed to load the sound',
                    error,
                    'from path',
                    soundPath
                )
                return
            }

            setDuration(appleSound.getDuration())

            appleSound.play((success) => {
                if (success) {
                    // playSound(soundPath);
                } else {
                    console.warn('Playback failed due to audio decoding errors')
                }
            })
        }
    )
}

export { playSound, AudioPlayer }
