import axios from 'axios'
import { getTimestamp } from '../util/util'
import { ALL_ENTRIES_URL, POLLY_URL, SINGLE_ENTRIES_URL } from './api'
import {
    addChineseEntry,
    addEnglishEntry,
    AudioEntry,
    AudioEntryPair,
} from './audioentry'
import { makeRequest } from './util'

interface MetaObj {
    category: string
    creationdate: number
    filename: string
    id: string
    language: 'english' | 'chinese'
    text: string
}

const _getAllMeta = async (): Promise<MetaObj[]> => {
    const result = (await makeRequest('GET', ALL_ENTRIES_URL)) as string
    const parsedResult = JSON.parse(result)
    const items = parsedResult.Items as MetaObj[]
    return items
}

const getMetaAsAudioEntries = async (): Promise<
    Map<string, AudioEntryPair>
> => {
    const items = await _getAllMeta()
    const entries = items.map((item) => new AudioEntry(item))

    const idToAudioEntryPair = new Map<string, AudioEntryPair>()
    for (const newEntry of entries) {
        const id = newEntry.id
        let currentEntry = idToAudioEntryPair.get(id)
        if (currentEntry == null) {
            currentEntry = new AudioEntryPair()
            idToAudioEntryPair.set(id, currentEntry)
        }
        if (newEntry.language == 'chinese') {
            addChineseEntry(currentEntry, newEntry)
        } else {
            addEnglishEntry(currentEntry, newEntry)
        }
    }
    return idToAudioEntryPair
}

/**
 * @returns {Promise<{categories: string[], categoriesWithCounts: string[]}>}
 */
const getCategories = async () => {
    const items = await _getAllMeta()

    const categoryToCount = new Map()
    for (const item of items) {
        if (item.language != 'chinese') {
            const category = item.category
            if (categoryToCount.get(category) == null) {
                categoryToCount.set(category, 1)
            } else {
                categoryToCount.set(category, categoryToCount.get(category) + 1)
            }
        }
    }

    const categoriesWithCounts = Array.from(categoryToCount).map(
        ([category, count]) => `${category} (${count})`
    )

    return {
        categories: Array.from(categoryToCount.keys()),
        categoriesWithCounts,
    }
}

const submitMetadata = async (
    sharedId: string,
    text: string,
    filename: string,
    category: string,
    language: 'english' | 'chinese'
) => {
    const creationdate = new Date().getTime()
    const params = JSON.stringify({
        id: sharedId,
        text,
        filename,
        creationdate,
        category,
        language,
        action: 'add',
    })

    const apiTestXhr = new XMLHttpRequest()
    const isAsync = true
    apiTestXhr.open('PUT', SINGLE_ENTRIES_URL, isAsync)
    apiTestXhr.setRequestHeader('Content-type', 'application/json')
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        // console.log("response", e.target.response)
    }
    const result = await apiTestXhr.send(params)
    return result
}

const removeEntry = async (englishFile: string, chineseFile: string) => {
    await removeRequest(englishFile)
    await removeRequest(chineseFile)
}

const removeRequest = async (filename: string) => {
    const apiTestXhr = new XMLHttpRequest()
    const isAsync = true
    apiTestXhr.open('PUT', SINGLE_ENTRIES_URL, isAsync)
    apiTestXhr.setRequestHeader('Content-type', 'application/json')
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        // console.log("response", e.target.response)
    }
    const params = JSON.stringify({
        filename,
        action: 'delete',
    })
    const result = await apiTestXhr.send(params)
}

/**
 * @param {string} filename
 */
const getMeta = async (filename) => {
    const params = `filename=${filename}`
    const apiUrl = SINGLE_ENTRIES_URL

    const apiTestXhr = new XMLHttpRequest()
    const isAsync = true
    apiTestXhr.open('GET', apiUrl + '?' + params, isAsync)
    apiTestXhr.setRequestHeader('Content-type', 'application/json')
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        // console.warn(e.target.response);
        // console.warn(Object.keys(e.target));
    }
    const result = await apiTestXhr.send(null)
    return result
}

/**
 * @param {string} url
 * @param {string} text
 * @param {string} voice
 * @param {string} prefix
 * @param {() => void} onReadyCall
 * @returns {string}
 */
const generateAudio = (url, text, voice, prefix, onReadyCall = null) => {

    console.log("Hitting generate audio")

    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`

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

    // const pollyXhr = new XMLHttpRequest()
    // const isAsync = true
    // pollyXhr.open('POST', apiUrl, isAsync)
    // pollyXhr.setRequestHeader('Content-type', 'application/json')
    // pollyXhr.onreadystatechange = function (e) {
    //     // @ts-ignore
    //     // console.warn('response', e.target.response);
    //     if (onReadyCall != null) {
    //         onReadyCall()
    //     }
    // }
    // pollyXhr.send(params)

    return `${prefix}_${text}`
}

const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const makeNewAudioEntry = async (
    english: string,
    chinese: string,
    category: string,
    onReadyCall: () => void
) => {
    if (category == '') {
        throw new Error('Category must be non-empty')
    }

    console.log('generating polly audio')
    const { englishFilename, chineseFilename } = await generatePollyAudio(
        english,
        chinese,
        onReadyCall
    )
    const id = `id-${english}-${chinese}`
    await submitMetadata(id, english, englishFilename, category, 'english')
    await sleep(100)
    await submitMetadata(id, chinese, chineseFilename, category, 'chinese')
}

const makeMultipleAudioEntries = async (entries: string[]) => {
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
        await makeNewAudioEntry(english, chinese, category, () => {})
    }
}

interface GeneratePollyAudioReturned {
    englishFilename: string
    chineseFilename: string
}

const generatePollyAudio = async (
    english: string,
    chinese: string,
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
        onReadyCall
    )

    console.log('generated chinese', chineseFilename)

    const englishFilename = await generateAudio(
        POLLY_URL,
        english,
        englishVoice,
        getTimestamp(),
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
    getMeta,
    getCategories,
    makeNewAudioEntry,
    getMetaAsAudioEntries,
    MetaObj,
    removeEntry,
    makeMultipleAudioEntries,
}
