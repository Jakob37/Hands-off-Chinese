import { getTimestamp } from "../util/util"
import { AudioEntry, AudioEntryPair } from "./audioentry"
import { makeRequest } from "./util"

interface MetaObj {
    category: string
    creationdate: number
    filename: string
    id: string
    language: "english" | "chinese"
    text: string
}

const _getAllMeta = async (): Promise<MetaObj[]> => {
    const apiUrl =
        "https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/allmeta"
    const result = (await makeRequest("GET", apiUrl)) as string
    const items = JSON.parse(result).body.Items as MetaObj[]
    return items
}

const getMetaAsAudioEntries = async (): Promise<
    Map<string, AudioEntryPair>
> => {
    const items = await _getAllMeta()
    const entries = items.map((item) => new AudioEntry(item))

    const idToAudioEntryPair = new Map<string, AudioEntryPair>()
    for (const entry of entries) {
        const id = entry.id
        let currentEntry = idToAudioEntryPair.get(id)
        if (currentEntry == null) {
            currentEntry = new AudioEntryPair()
            idToAudioEntryPair.set(id, currentEntry)
        }
        if (entry.language == "chinese") {
            currentEntry.addChineseEntry(entry)
        } else {
            currentEntry.addEnglishEntry(entry)
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
        if (item.language != "chinese") {
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
    language: "english" | "chinese"
) => {
    const creationdate = new Date().getMilliseconds()
    const params = JSON.stringify({
        id: sharedId,
        text,
        filename,
        creationdate,
        category,
        language,
        action: "add",
    })
    const apiUrl =
        "https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta"

    const apiTestXhr = new XMLHttpRequest()
    const isAsync = true
    apiTestXhr.open("PUT", apiUrl, isAsync)
    apiTestXhr.setRequestHeader("Content-type", "application/json")
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        console.log("response", e.target.response)
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
    const apiUrl =
        "https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta"
    const isAsync = true
    apiTestXhr.open("PUT", apiUrl, isAsync)
    apiTestXhr.setRequestHeader("Content-type", "application/json")
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        console.log("response", e.target.response)
    }
    const params = JSON.stringify({
        filename,
        action: "delete",
    })
    console.log("request for params", params)
    const result = await apiTestXhr.send(params)
}

/**
 * @param {string} filename
 */
const getMeta = async (filename) => {
    const params = `filename=${filename}`
    const apiUrl = `https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta`

    const apiTestXhr = new XMLHttpRequest()
    const isAsync = true
    apiTestXhr.open("GET", apiUrl + "?" + params, isAsync)
    apiTestXhr.setRequestHeader("Content-type", "application/json")
    apiTestXhr.onreadystatechange = (e) => {
        // @ts-ignore
        // console.warn(e.target.response);
        // console.warn(Object.keys(e.target));
    }
    const result = await apiTestXhr.send(null)
    return result
}

/**
 * @param {string} apiUrl
 * @param {string} text
 * @param {string} voice
 * @param {string} prefix
 * @param {() => void} onReadyCall
 * @returns {string}
 */
const generateAudio = (apiUrl, text, voice, prefix, onReadyCall = null) => {
    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`

    const pollyXhr = new XMLHttpRequest()
    const isAsync = true
    pollyXhr.open("POST", apiUrl, isAsync)
    pollyXhr.setRequestHeader("Content-type", "application/json")
    pollyXhr.onreadystatechange = function (e) {
        // @ts-ignore
        // console.warn('response', e.target.response);
        if (onReadyCall != null) {
            onReadyCall()
        }
    }
    pollyXhr.send(params)

    return `${prefix}_${text}`
}

const makeNewAudioEntry = async (
    english: string,
    chinese: string,
    category: string,
    onReadyCall: () => void
) => {
    if (category == "") {
        throw new Error("Category must be non-empty")
    }

    const { englishFilename, chineseFilename } = generatePollyAudio(
        english,
        chinese,
        onReadyCall
    )
    const id = `id-${new Date().getMilliseconds()}`
    submitMetadata(id, english, englishFilename, category, "english")
    submitMetadata(id, chinese, chineseFilename, category, "chinese")
}

const makeMultipleAudioEntries = (entries: [string, string, string][]) => {
    for (const row of entries) {
        if (row.length < 3) {
            throw new Error(
                `Each row should contain at least three entries. Found: ${row}`
            )
        }
    }

    for (const [category, chinese, english] of entries) {
        makeNewAudioEntry(english, chinese, category, () => {
            console.log(`Uploaded entry: ${category} ${chinese} ${english}`)
        })
    }
}

/**
 * @param {string} english
 * @param {string} chinese
 * @param {() => void} onReadyCall
 * @returns {{englishFilename:string, chineseFilename:string}}
 */
const generatePollyAudio = (english, chinese, onReadyCall) => {
    const englishVoice = "Emma"
    const chineseVoice = "Zhiyu"

    const chineseFilename = generateAudio(
        "https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly",
        chinese,
        chineseVoice,
        getTimestamp(),
        onReadyCall
    )

    const englishFilename = generateAudio(
        "https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly",
        english,
        englishVoice,
        getTimestamp(),
        onReadyCall
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
