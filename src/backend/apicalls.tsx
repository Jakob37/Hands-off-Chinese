import axios from 'axios'
import { getTimestamp } from '../util/util'
import { ALL_ENTRIES_URL, POLLY_URL, SINGLE_ENTRIES_URL } from './api'
import { AudioEntryPair, getAudioEntryPair } from './audioentry'

interface MetaObj {
    category: string
    creationdate: number
    filename: string
    id: string
    language: 'english' | 'chinese'
    text: string
}

interface NewMeta {
    chinese: string
    filenamechinese: string
    filenameenglish: string
    english: string
    category: string
    user: string
    creationdate: string
    id: string
}

const _getAllMeta = async (): Promise<{ Items: NewMeta[] }> => {
    const params = {}
    const promise = axios
        .get(ALL_ENTRIES_URL, params)
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

    return promise
}

const getMetaAsAudioEntries = async (): Promise<
    Map<string, AudioEntryPair>
> => {
    const items = await _getAllMeta()
    const entries = items.Items.map((item) => {
        return [
            item.id,
            getAudioEntryPair(
                item.id,
                item.user,
                item.creationdate,
                item.chinese,
                item.filenamechinese,
                item.english,
                item.filenameenglish,
                item.category
            ),
        ]
    })

    const resultingMap = new Map(entries as [string, AudioEntryPair][])
    return resultingMap
}

const makeNewAudioEntry = async (
    english: string,
    chinese: string,
    category: string,
    user: string,
    onReadyCall: () => void
) => {
    if (category == '') {
        throw new Error('Category must be non-empty')
    }

    const { englishFilename, chineseFilename } = await generatePollyAudio(
        english,
        chinese,
        user,
        onReadyCall
    )
    const id = `id-${english}-${chinese}`

    await submitMetaDataNew(
        id,
        user,
        english,
        chinese,
        englishFilename,
        chineseFilename,
        new Date().getTime().toString(),
        category
    )

    // await submitMetadata(id, english, englishFilename, category, 'english')
    // await sleep(100)
    // await submitMetadata(id, chinese, chineseFilename, category, 'chinese')
}

const submitMetaDataNew = async (
    id: string,
    user: string,
    english: string,
    chinese: string,
    filenameenglish: string,
    filenamechinese: string,
    creationdate: string,
    category: string
) => {
    const params = {
        id,
        user,
        english,
        chinese,
        filenameenglish,
        filenamechinese,
        creationdate,
        category,
    }
    console.log('Submitting meta data', params)
    axios
        .post(SINGLE_ENTRIES_URL, params)
        .then(function (response) {
            console.log('Response!')
            console.log(response.data)
            console.log(Object.keys(response))
        })
        .catch(function (error) {
            console.log('error')
            if (error.response) {
                console.log(error.response.data)
            } else {
                console.log('Unknown error type encountered')
                console.log(error)
            }
        })
}

// const removeEntry = async (englishFile: string, chineseFile: string) => {
//     await removeRequest(englishFile)
//     await removeRequest(chineseFile)
// }

// const removeRequest = async (filename: string) => {
//     const apiTestXhr = new XMLHttpRequest()
//     const isAsync = true
//     apiTestXhr.open('PUT', SINGLE_ENTRIES_URL, isAsync)
//     apiTestXhr.setRequestHeader('Content-type', 'application/json')
//     apiTestXhr.onreadystatechange = (e) => {
//         // @ts-ignore
//         // console.log("response", e.target.response)
//     }
//     const params = JSON.stringify({
//         filename,
//         action: 'delete',
//     })
//     const result = await apiTestXhr.send(params)
// }

const generateAudio = (
    url: string,
    text: string,
    voice: string,
    prefix: string,
    user: string,
    onReadyCall: () => void | null = null
): string => {
    console.log('Hitting generate audio')

    const params = { text: text, voice: voice, prefix: prefix, user }

    axios
        .post(url, params)
        .then(function (response) {
            console.log(response.data)
            console.log(Object.keys(response))
            if (onReadyCall != null) {
                onReadyCall()
            }
        })
        .catch(function (error) {
            console.log('error')
            if (error.response) {
                console.log(error.response.data)
            } else {
                console.log('Unknown error type encountered')
                console.log(error)
            }
        })

    return `${prefix}_${text}`
}

const makeMultipleAudioEntries = async (user: string, entries: string[]) => {
    for (const row of entries) {
        if (row.length == 1 && row[0] == '') {
            console.log('Skipping empty row')
            continue
        }
        console.log('Processing row', row)
        if (row.length < 3) {
            throw new Error(
                `Each row should contain at least three entries. Found: ${row}`
            )
        }
    }

    for (const entry of entries) {
        const category = entry[0]
        const chinese = entry[1]
        const english = entry[2]
        await makeNewAudioEntry(english, chinese, category, user, () => {})
    }
}

interface GeneratePollyAudioReturned {
    englishFilename: string
    chineseFilename: string
}

const generatePollyAudio = async (
    english: string,
    chinese: string,
    user: string,
    onReadyCall: () => void
): Promise<GeneratePollyAudioReturned> => {
    const englishVoice = 'Emma'
    const chineseVoice = 'Zhiyu'

    console.log('starting generating')

    const chineseFilename = await generateAudio(
        POLLY_URL,
        chinese,
        chineseVoice,
        getTimestamp(),
        user,
        onReadyCall
    )

    console.log('generated chinese', chineseFilename)

    const englishFilename = await generateAudio(
        POLLY_URL,
        english,
        englishVoice,
        getTimestamp(),
        user,
        onReadyCall
    )
    console.log(
        'Generating english audio for',
        english,
        'got filename',
        englishFilename
    )
    return { chineseFilename, englishFilename }
}

export {
    makeNewAudioEntry,
    getMetaAsAudioEntries,
    MetaObj,
    makeMultipleAudioEntries,
}
