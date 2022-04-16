import Sound from 'react-native-sound'
import axios from 'axios'
import { SIGNEDURL_URL } from '../../backend/api'
import { AudioEntryPair } from 'src/backend/audioentry'

// React native sound
// https://github.com/benevbright/react-native-sound-playerview

const getSignedUrl = (key): Promise<string> => {
    return axios
        .post(SIGNEDURL_URL, { filename: key })
        .then(function (response) {
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
    id: string,
    user: string,
    callback: ((track: Sound) => void) | null = null
) => {
    const key = `${user}/${id}`
    console.log('Attempting to play audio for key', key)
    const signedUrl = await getSignedUrl(key)

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
