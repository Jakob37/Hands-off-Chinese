import { MetaObj } from "./apicalls"

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
        ].join("\n")
    }
}

class AudioEntryPair {
    chineseEntry: AudioEntry | null = null
    englishEntry: AudioEntry | null = null

    id: string
    category: string
    creationdate: number
    englishKey: string
    chineseKey: string
    english: string
    chinese: string

    paused: boolean = false

    assignEntry(entry: AudioEntry) {
        this.id = entry.id
        this.category = entry.category
        this.creationdate = entry.creationdate
    }

    addChineseEntry(chineseEntry: AudioEntry) {
        console.assert(chineseEntry == null)
        this.chineseEntry = chineseEntry
        this.assignEntry(chineseEntry)
        this.chineseKey = chineseEntry.filename
        this.chinese = chineseEntry.text
    }

    addEnglishEntry(englishEntry: AudioEntry) {
        console.assert(englishEntry == null)
        this.englishEntry = englishEntry
        this.assignEntry(englishEntry)
        this.englishKey = englishEntry.filename
        this.english = englishEntry.text
    }

    isComplete(): boolean {
        return this.chineseEntry != null && this.englishEntry != null
    }

    getListFormat(): [string,string,string,string,boolean] {
        return [
            this.english,
            this.englishKey,
            this.chinese,
            this.chineseKey,
            true,
        ]
    }

    toString(): string {
        return [
            `ID: ${this.id}`,
            `Is complete: ${this.isComplete()}`,
            `Category: ${this.category}`,
            `Creation date: ${this.creationdate}`,
            `English file name: ${this.englishKey}`,
            `Chinese file name: ${this.chineseKey}`,
            `English text: ${this.english}`,
            `Chinese text: ${this.chinese}`,
        ].join("\n")
    }
}

export { AudioEntry, AudioEntryPair }
