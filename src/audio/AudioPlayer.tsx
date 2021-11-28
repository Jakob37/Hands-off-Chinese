import { default as Sound } from "react-native-sound"
import { playAudio } from "../views/card/audiocard"
// import { audioLibraries } from "./Database";
import { getRandomFromArray } from "../util/util"
import { AudioEntryPair } from "src/backend/audioentry"

Sound.setCategory("Playback")

class AudioPair {
    /** @type {string} */
    englishPath
    /** @type {string} */
    chinesePath
    /** @type {Sound} */
    englishAudio
    /** @type {Sound} */
    chineseAudio
    /**
     * @param {string} englishPath
     * @param {string} chinesePath
     */
    constructor(englishPath, chinesePath) {
        this.englishPath = englishPath
        this.chinesePath = chinesePath
        // this.englishAudio = testLoad(englishPath)
        // this.chineseAudio = testLoad(chinesePath)
    }
}

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

    isPlaying = false

    load(audioEntries: AudioEntryPair[]) {
        console.log("loading in audio player")
        this.audio = audioEntries
        // for (const entry of audioEntries) {
        //     const english = entry.englishEntry
        //     const chinese = entry.chineseEntry
        //     const audioPair = new AudioPair(english, chinese)
        //     this.audio.push(audioPair)
        // }
    }

    setDelay(delay: number) {
        this.delay = delay
    }

    playRandom() {
        console.log("playing random")
        const audioEntry = getRandomFromArray(this.audio)
        this.currentlyPlayingPair = audioEntry
        console.log(audioEntry)
        playAudio(audioEntry.chineseFilename, () => {
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
            playAudio(currAudio.chinesePath, () => {
                this.playEvent()
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

    play() {
        this.audioState = AudioState.playing_english
        this.isPlaying = true
        this.playEvent()
    }

    stop() {
        this.audioState = AudioState.stopped
        this.isPlaying = false
    }
}

function testLoad(soundPath: string): Sound {
    const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.warn(
                "failed to load the sound",
                error,
                "from path",
                soundPath
            )
            return
        }
    })
    return sound
}

async function playSound(soundPath: string) {
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

const audioPlayer = new AudioPlayer()

export { playSound, testLoad, AudioPlayer, audioPlayer }
