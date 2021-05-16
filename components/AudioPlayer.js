import { default as Sound } from "react-native-sound";

Sound.setCategory("Playback");

class AudioPlayer {

    /** @type {Map<string,Sound>} */
    audio = new Map();

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
     * @param {function} onSuccess
     */
    playRandom() {
        
    }

    /**
     * @param {number} index
     * @param {function} onSuccess
     */
    playIndex(index, onSuccess) {
        const firstKey = Array.from(this.audio.keys())[index];
        this.playPath(firstKey, onSuccess);
    }

    /**
     * @param {string} path 
     * @param {function} onSuccess 
     */
    playPath(path, onSuccess) {
        const firstAudio = this.audio.get(path);
        // const duration = firstAudio.getDuration();
        // firstAudio.play();

        firstAudio.play((success) => {
            if (success) {
                onSuccess();
                // console.log("Successfully finished playing");
                // playSound(soundPath);
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
