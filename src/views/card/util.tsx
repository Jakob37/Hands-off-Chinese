import Sound from 'react-native-sound'
import axios from 'axios'
import { SIGNEDURL_URL } from '../../backend/api'
// import { Storage } from 'aws-amplify'
// import awsmobile from "../../../src/aws-exports"

const getSignedUrl = (key): Promise<string> => {
    return axios
        .post(SIGNEDURL_URL, { filename: `public/${key}` })
        .then(function (response) {
            console.log(Object.keys(response))
            return response.data
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data)
            } else {
                console.log(error)
            }
        })
}

// FIXME: Clearly move this to util location
const playAudio = async (
    key: string,
    callback: ((track: Sound) => void) | null = null
) => {
    console.log('Attempting to play audio for key', key)
    const signedUrl = await getSignedUrl(key)

    // console.log('Config', awsmobile)
    // const config = awsmobile;
    // const signedUrl = await Storage.get(key, awsmobile)
    // console.log('Signed URL', signedUrl)

    console.log(signedUrl)
    const track = new Sound(signedUrl, null, (e) => {
        if (e) {
            console.warn('error loading track:', e)
        } else {
            console.log('Debugging, pausing audio playing')
            if (callback != null) {
                track.play(() => {
                    callback(track)
                })
            } else {
                track.play()
            }
        }
    })
}

export { playAudio }
