import { MetaObj } from './apicalls'

class AudioEntry {
    category: string
    creationdate: number
    filename: string
    id: string
    language: string
    text: string

    constructor(metaObj: MetaObj) {
        this.category = metaObj.category as string
        this.creationdate = metaObj.creationdate as number
        this.filename = metaObj.filename as string
        this.id = metaObj.id as string
        this.language = metaObj.language as string
        this.text = metaObj.text as string
    }

    toString(): string {
        return [
            `Category: ${this.category}`,
            `Date: ${this.creationdate}`,
            `Filename: ${this.filename}`,
            `ID: ${this.id}`,
            `Language: ${this.language}`,
            `Text: ${this.text}`,
        ].join('\n')
    }
}

class AudioEntryPair {
    chineseEntry: AudioEntry | null = null
    englishEntry: AudioEntry | null = null

    id: string
    category: string
    creationdate: number
    user: string
    englishKey: string
    chineseKey: string
    english: string
    chinese: string

    paused: boolean = false
}

function getAudioEntryPair(
    id,
    user,
    creationdate,
    chinese,
    chineseFile,
    english,
    englishFile,
    category
): AudioEntryPair {
    const audioEntryPair = new AudioEntryPair()
    audioEntryPair.id = id
    audioEntryPair.user = user
    audioEntryPair.creationdate = creationdate
    audioEntryPair.category = category

    audioEntryPair.english = english
    audioEntryPair.chinese = chinese
    audioEntryPair.chineseEntry = new AudioEntry({
        category,
        creationdate,
        filename: chineseFile,
        id,
        language: 'chinese',
        text: chinese,
    })
    audioEntryPair.chineseKey = chineseFile
    audioEntryPair.englishEntry = new AudioEntry({
        category,
        creationdate,
        filename: englishFile,
        id,
        language: 'english',
        text: english,
    })
    audioEntryPair.englishKey = englishFile
    return audioEntryPair
}

function copyEntry(entry: AudioEntryPair): AudioEntryPair {
    const copy = new AudioEntryPair()
    copy.chineseEntry = entry.chineseEntry
    copy.englishEntry = entry.englishEntry

    copy.id = entry.id
    copy.category = entry.category
    copy.creationdate = entry.creationdate
    copy.englishKey = entry.englishKey
    copy.chineseKey = entry.chineseKey
    copy.english = entry.english
    copy.chinese = entry.chinese
    copy.paused = entry.paused
    return copy
}

function assignEntry(entry: AudioEntryPair, newEntry: AudioEntry) {
    entry.id = newEntry.id
    entry.category = newEntry.category
    entry.creationdate = newEntry.creationdate
}

function addChineseEntry(entry: AudioEntryPair, chineseEntry: AudioEntry) {
    console.assert(chineseEntry == null)
    entry.chineseEntry = chineseEntry
    assignEntry(entry, chineseEntry)
    entry.chineseKey = chineseEntry.filename
    entry.chinese = chineseEntry.text
}

function addEnglishEntry(entry: AudioEntryPair, englishEntry: AudioEntry) {
    console.assert(englishEntry == null)
    entry.englishEntry = englishEntry
    assignEntry(entry, englishEntry)
    entry.englishKey = englishEntry.filename
    entry.english = englishEntry.text
}

function isComplete(entry: AudioEntryPair): boolean {
    return entry.chineseEntry != null && entry.englishEntry != null
}

function getListFormat(
    entry: AudioEntryPair
): [string, string, string, string, boolean] {
    return [
        entry.english,
        entry.englishKey,
        entry.chinese,
        entry.chineseKey,
        true,
    ]
}

function entryToString(entry: AudioEntryPair): string {
    return [
        `ID: ${entry.id}`,
        `Is complete: ${isComplete(entry)}`,
        `Category: ${entry.category}`,
        `Creation date: ${entry.creationdate}`,
        `English file name: ${entry.englishKey}`,
        `Chinese file name: ${entry.chineseKey}`,
        `English text: ${entry.english}`,
        `Chinese text: ${entry.chinese}`,
    ].join('\n')
}

export {
    AudioEntry,
    AudioEntryPair,
    copyEntry,
    assignEntry,
    addChineseEntry,
    addEnglishEntry,
    isComplete,
    getListFormat,
    entryToString,
    getAudioEntryPair,
}
