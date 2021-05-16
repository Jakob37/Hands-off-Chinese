import { default as Sound } from "react-native-sound";
import { getRandomFromArray } from "./util";

Sound.setCategory("Playback");

class AudioPair {
    englishPath;
    chinesePath;
    englishAudio;
    chineseAudio;
    constructor(englishPath, chinesePath) {
        this.englishPath = englishPath;
        this.chinesePath = chinesePath;
        this.englishAudio = testLoad(englishPath);
        this.chineseAudio = testLoad(chinesePath);
    }
}

class AudioPlayer {

    /** @type {AudioPair[]} */
    audio = [];

    isPlaying = false;

    currentlyPlayingPair = null;

    /**
     * @param {[string,string][]} audioPathPairs
     */
    constructor(audioPathPairs) {
        for (const [english, chinese] of audioPathPairs) {
            const audioPair = new AudioPair(english, chinese);
            this.audio.push(audioPair);
        }

        console.log(`Finished loading ${audioPathPairs.length} clips`);
    }

    playRandom() {

        const pair = getRandomFromArray(this.audio);
        console.log('found pair', pair);
        this.currentlyPlayingPair = pair;
        // this.playPath(pair.englishAudio);
        this.currentlyPlayingPair.englishAudio.play((success) => {
            if (success) {
                this.playEvent();
                console.log("Successfully finished playing");
            } else {
                console.log("Playback failed due to audio decoding errors");
            }
        });
    }

    /**
     * @returns {number}
     */
    getNumberClips() {
        return this.audio.length;
    }

    playEvent() {
        if (this.isPlaying) {
            if (this.currentlyPlayingPair == null) {
                this.playRandom();
            } else {
                const currAudio = this.currentlyPlayingPair;
                this.currentlyPlayingPair = null;
                currAudio.chineseAudio.play((success) => {
                    this.playEvent();
                })
            }
        }
    }

    play() {
        console.log('Starting audio player');
        this.isPlaying = true;
        this.playEvent();
    }

    stop() {
        console.log('Stopping audio player');
        this.isPlaying = false;
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
            );
            return;
        }
    });
    return sound;
}

async function playSound(soundPath) {
    console.log(soundPath);
    const appleSound = await new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log(
                "failed to load the sound",
                error,
                "from path",
                soundPath
            );
            return;
        }

        appleSound.play((success) => {
            if (success) {
                console.log("Successfully finished playing");
                // playSound(soundPath);
            } else {
                console.log("Playback failed due to audio decoding errors");
            }
        });
    });
}

export { playSound, testLoad, AudioPlayer };
