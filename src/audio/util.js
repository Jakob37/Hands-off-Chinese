import Sound from "react-native-sound";

const playTestSound = () => {
    const track = new Sound(
        'testsound.309bc55b-b25e-4641-8d24-04639818e4f3.mp3',
        'https://hands-off-chinese.s3.eu-north-1.amazonaws.com', (e) => {
        if (e) {
            console.log('error loading track:', e)
        } else {
            track.play()
        }
    })
}

export { playTestSound };
