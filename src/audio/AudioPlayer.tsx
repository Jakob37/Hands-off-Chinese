import { default as Sound } from "react-native-sound"
import { playAudio } from "../views/card/audiocard"
// import { audioLibraries } from "./Database";
import { getRandomFromArray } from "../util/util"
import { AudioEntryPair } from "src/backend/audioentry"
import { HocDb } from "src/backend/database"

Sound.setCategory("Playback")

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

    getActiveAudioPairs(): AudioEntryPair[] {
        const activeAudioPairs = []
        for (const audioPair of this.allAudioPairs) {
            if (this.db.getIsActive(audioPair.id)) {
                activeAudioPairs.push(audioPair)
            }
        }
        return activeAudioPairs
    }

    audioState: number = AudioState.stopped
    currentlyPlayingPair: AudioEntryPair | null = null
    delay: number = 3000

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

    load(audioEntries: AudioEntryPair[], db: HocDb) {
        this.allAudioPairs = audioEntries
        this.db = db
    }

    setDelay(delay: number) {
        this.delay = delay
    }

    playRandom() {
        const audioEntry = getRandomFromArray(this.getActiveAudioPairs())
        this.currentlyPlayingPair = audioEntry
        playAudio(audioEntry.englishFilename, () => {
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

        if (this.audioState == AudioState.playing_english) {
            this.playRandom()
            this.audioState = AudioState.english_pause
        } else if (this.audioState == AudioState.english_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_chinese
        } else if (this.audioState == AudioState.playing_chinese) {
            const currAudio = this.currentlyPlayingPair
            playAudio(currAudio.chineseFilename, (sound: Sound) => {
                this.playEvent()
                this.durationHook(Math.round(sound.getDuration()))
            })
            this.audioState = AudioState.chinese_pause
        } else if (this.audioState == AudioState.chinese_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_english
        } else {
            console.warn("Unknown situation for audio state:", this.audioState)
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
                    "failed to load the sound",
                    error,
                    "from path",
                    soundPath
                )
                return
            }

            setDuration(appleSound.getDuration())

            appleSound.play((success) => {
                if (success) {
                    // playSound(soundPath);
                } else {
                    console.warn("Playback failed due to audio decoding errors")
                }
            })
        }
    )
}

export { playSound, AudioPlayer }
