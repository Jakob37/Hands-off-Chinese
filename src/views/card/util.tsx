import Sound from "react-native-sound"
import { Storage } from 'aws-amplify'
import awsmobile from "../../../src/aws-exports"


// FIXME: Clearly move this to util location
const playAudio = async (
    key: string,
    callback: ((track: Sound) => void) | null = null
) => {

    console.log('Attempting to play audio for key', key)
    console.log('Config', awsmobile)

    const config = awsmobile;

    const signedUrl = await Storage.get(key, awsmobile)

    // console.log('Signed URL', signedUrl)

    // const track = new Sound(signedUrl, null, (e) => {
    //     if (e) {
    //         console.warn('error loading track:')
    //         // console.warn('error loading track:', e)
    //     } else {
    //         console.log('Debugging, pausing audio playing')
    //         // if (callback != null) {
    //         //     track.play(() => {
    //         //         callback(track)
    //         //     })
    //         // } else {
    //         //     track.play()
    //         // }
    //     }
    // })
}

export { playAudio }
