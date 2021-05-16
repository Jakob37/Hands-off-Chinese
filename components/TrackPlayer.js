import Sound from 'react-native-sound';
import TrackPlayer from 'react-native-track-player';

// https://github.com/react-native-kit/react-native-track-player

class TrackPlayerWrapper {

    constructor() {


    }

    async init() {
        await TrackPlayer.setupPlayer();

        const audioPath = `./ilikeapples_chinese.mp3`;

        console.log(audioPath)

        await TrackPlayer.add({
            id: 'testId',
            url: audioPath,
            title: 'I like apples',
            artist: 'no artist'
        })

        await TrackPlayer.play();
        console.log('Starting player track player');

        // TrackPlayer.setupPlayer().then(() => {
        //     console.log('TrackPlayer ready to be used!');
        // });
    }
}

export { TrackPlayerWrapper };
