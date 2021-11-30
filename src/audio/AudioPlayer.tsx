import { default as Sound } from "react-native-sound"
import { playAudio } from "../views/card/audiocard"
// import { audioLibraries } from "./Database";
import { getRandomFromArray } from "../util/util"
import { AudioEntryPair } from "src/backend/audioentry"

Sound.setCategory("Playback")

const AudioState = Object.freeze({
    stopped: 1,
    playing_english: 2,
    english_pause: 3,
    playing_chinese: 4,
    chinese_pause: 5,
})

class AudioPlayer {
    audio: AudioEntryPair[] = []
    audioState: number = AudioState.stopped
    currentlyPlayingPair: AudioEntryPair | null = null
    delay: number = 3000

    startTime: number = 0
    getTimeSinceStart(): number {
        return (new Date().getTime() - this.startTime) / 1000
    }

    isPlaying: boolean = false

    getState(): string {
        return Object.keys(AudioState)[this.audioState]
    }

    load(audioEntries: AudioEntryPair[]) {
        this.audio = audioEntries
    }

    setDelay(delay: number) {
        this.delay = delay
    }

    playRandom() {
        const audioEntry = getRandomFromArray(this.audio)
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
        return this.audio.length
    }

    // lastDuration: number
    durationHook: (duration:number) => void
    addDurationHook(durationHook: (duration: number) => void) {
        this.durationHook = durationHook
    }

    playEvent() {
        if (!this.isPlaying) {
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
            // this.currentlyPlayingPair = null;
            playAudio(currAudio.chineseFilename, (sound: Sound) => {
                console.log('sound duration', sound.getDuration())
                this.playEvent()
                this.durationHook(sound.getDuration())
            })

            // currAudio.chineseAudio.play((_success) => {
            //     this.playEvent()
            // })
            this.audioState = AudioState.chinese_pause
        } else if (this.audioState == AudioState.chinese_pause) {
            this.playPause(this.delay)
            this.audioState = AudioState.playing_english
        } else {
            console.warn("Unknown situation for audio state:", this.audioState)
        }
    }

    counter: number = 0
    hook: (value: number) => void

    addTimerHook(hook: (value: number) => void) {
        this.hook = hook
    }

    interval: NodeJS.Timer

    play() {
        this.startTime = new Date().getTime()
        this.audioState = AudioState.playing_english
        this.isPlaying = true
        this.playEvent()

        this.interval = setInterval(() => {
            console.log("test", this.counter)
            this.counter += 1
            this.hook(this.counter)
        }, 1000)
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
