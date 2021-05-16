import { default as Sound } from "react-native-sound";
import { getRandomFromArray } from "./util";

Sound.setCategory("Playback");

class AudioPlayer {

    /** @type {Map<string,Sound>} */
    audio = new Map();

    isPlaying = false;

    /**
     * @param {string[]} audioPaths 
     */
    constructor(audioPaths) {
        // this.audioPaths = audioPaths;
        for (const path of audioPaths) {
            this.audio.set(path, testLoad(path));
        }

        console.log(`Finished loading ${audioPaths.length} clips`);
    }

    /**
     * @returns {string[]}
     */
    _getPaths() {
        return Array.from(this.audio.keys())
    }

    playRandom() {

        const randomPath = getRandomFromArray(this._getPaths());
        console.log('found path', randomPath);
        this.playPath(randomPath);
    }

    /**
     * @param {number} index
     */
    playIndex(index) {
        console.log('All paths', this._getPaths(), 'index', index);
        const firstKey = this._getPaths()[index];
        this.playPath(firstKey);
    }

    /**
     * @param {string} path 
     */
    playPath(path) {
        console.log('Attempting to play path', path);
        const firstAudio = this.audio.get(path);
        // const duration = firstAudio.getDuration();
        // firstAudio.play();

        firstAudio.play((success) => {
            if (success) {
                // onSuccess();
                // this.dispatchEvent();
                this.playEvent();

                console.log("Successfully finished playing");
                // this.playSound(soundPath);
            } else {
                console.log("Playback failed due to audio decoding errors");
            }
        });

        // return duration * 1000;
    }

    /**
     * @returns {number}
     */
    getNumberClips() {
        return this.audio.size;
    }

    playEvent() {
        if (this.isPlaying) {
            this.playRandom();
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
