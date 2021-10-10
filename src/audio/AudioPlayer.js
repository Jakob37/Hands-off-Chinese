import { default as Sound } from "react-native-sound"
import { playAudio } from "../views/card/audiocard"
// import { audioLibraries } from "./Database";
import { getRandomFromArray } from "../util/util"

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
    /** @type {AudioPair[]} */
    audio = []
    audioState = AudioState.stopped
    /** @type {AudioPair} */
    currentlyPlayingPair = null
    delay = 3000

    isPlaying = false

    constructor() {
        // const defaultPairs = audioLibraries.get('Exam revision 4').pathPairs;
        // this.load(defaultPairs);
    }

    /**
     * @param {[string,string][]} audioPathPairs
     */
    load(audioPathPairs) {
        this.audio = []
        for (const [chinese, english] of audioPathPairs) {
            const audioPair = new AudioPair(english, chinese)
            this.audio.push(audioPair)
        }

        console.log(`Finished loading ${audioPathPairs.length} clips`)
    }

    /**
     * @param {number} delay
     */
    setDelay(delay) {
        this.delay = delay
    }

    playRandom() {
        const pair = getRandomFromArray(this.audio)
        // console.log('found pair', pair);
        this.currentlyPlayingPair = pair

        playAudio(pair.englishPath, () => { this.playEvent() })

        // this.playPath(pair.englishAudio);
        // this.currentlyPlayingPair.englishAudio.play((success) => {
        //     if (success) {
        //         this.playEvent();
        //         console.log("Successfully finished playing");
        //     } else {
        //         console.log("Playback failed due to audio decoding errors");
        //     }
        // });
    }

    /**
     * @param {number} duration
     */
    playPause(duration) {
        setTimeout(() => {
            this.playEvent()
        }, duration)
    }

    /**
     * @returns {number}
     */
    getNumberClips() {
        return this.audio.length
    }

    playEvent() {
        console.log('--- play event triggered ---')
        if (!this.isPlaying) {
            console.log("Not playing, returning!")
            return
        }

        if (this.audioState == AudioState.playing_english) {
            console.log('play random')
            this.playRandom()
            this.audioState = AudioState.english_pause
        } else if (this.audioState == AudioState.english_pause) {
            console.log('english_pause')
            this.playPause(this.delay)
            this.audioState = AudioState.playing_chinese
        } else if (this.audioState == AudioState.playing_chinese) {
            console.log('playing_chinese')
            const currAudio = this.currentlyPlayingPair
            // this.currentlyPlayingPair = null;
            playAudio(currAudio.chinesePath, () => { this.playEvent() })

            // currAudio.chineseAudio.play((_success) => {
            //     this.playEvent()
            // })
            this.audioState = AudioState.chinese_pause
        } else if (this.audioState == AudioState.chinese_pause) {
            console.log('chinese_pause')
            this.playPause(this.delay)
            this.audioState = AudioState.playing_english
        } else {
            console.warn("Unknown situation for audio state:", this.audioState)
        }
    }

    play() {
        console.log("Starting audio player")
        this.audioState = AudioState.playing_english
        this.isPlaying = true
        this.playEvent()
    }

    stop() {
        console.log("Stopping audio player!")
        this.audioState = AudioState.stopped
        console.log(this.audioState)
        this.isPlaying = false
    }
}

/**
 * @param {string} soundPath
 * @returns {Sound}
 */
function testLoad(soundPath) {
    const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log(
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

async function playSound(soundPath) {
    console.log(soundPath)
    const appleSound = await new Sound(
        soundPath,
        Sound.MAIN_BUNDLE,
        (error) => {
            if (error) {
                console.log(
                    "failed to load the sound",
                    error,
                    "from path",
                    soundPath
                )
                return
            }

            appleSound.play((success) => {
                if (success) {
                    console.log("Successfully finished playing")
                    // playSound(soundPath);
                } else {
                    console.log("Playback failed due to audio decoding errors")
                }
            })
        }
    )
}

const audioPlayer = new AudioPlayer()

export { playSound, testLoad, AudioPlayer, audioPlayer }
