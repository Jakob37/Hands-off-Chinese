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
    englishFilename: string
    chineseFilename: string
    englishText: string
    chineseText: string

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
        this.chineseFilename = chineseEntry.filename
        this.chineseText = chineseEntry.text
    }

    addEnglishEntry(englishEntry: AudioEntry) {
        console.assert(englishEntry == null)
        this.englishEntry = englishEntry
        this.assignEntry(englishEntry)
        this.englishFilename = englishEntry.filename
        this.englishText = englishEntry.text
    }

    isComplete(): boolean {
        return this.chineseEntry != null && this.englishEntry != null
    }

    getListFormat(): [string,string,string,string,boolean] {
        return [
            this.englishText,
            this.englishFilename,
            this.chineseText,
            this.chineseFilename,
            true,
        ]
    }

    toString(): string {
        return [
            `ID: ${this.id}`,
            `Is complete: ${this.isComplete()}`,
            `Category: ${this.category}`,
            `Creation date: ${this.creationdate}`,
            `English file name: ${this.englishFilename}`,
            `Chinese file name: ${this.chineseFilename}`,
            `English text: ${this.englishText}`,
            `Chinese text: ${this.chineseText}`,
        ].join("\n")
    }
}

export { AudioEntry, AudioEntryPair }
