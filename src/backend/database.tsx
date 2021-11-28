import { getMetaAsAudioEntries } from "./apicalls"
import { AudioEntryPair } from "./audioentry"

class Database {
    _idToEntry: Map<string, AudioEntryPair>
    _allEntries: AudioEntryPair[]

    async initDatabase(
        doneCallback: (db: Database) => void = (db: Database) => {}
    ) {
        this._idToEntry = await getMetaAsAudioEntries()
        this._allEntries = Array.from(this._idToEntry.values())
        doneCallback(this)
    }

    getCategories(): string[] {
        const allCategories = new Set(
            this._allEntries.map((entry) => entry.category)
        )
        const categoriesArray = Array.from(allCategories)
        categoriesArray.sort()
        return categoriesArray
    }

    _getCategoryToEntryPairs(): Map<string, AudioEntryPair[]> {
        const allCategories = this.getCategories()
        const categoryToEntryPairs = new Map()
        for (const category of allCategories) {
            categoryToEntryPairs.set(category, [])
        }

        for (const entry of this._allEntries) {
            categoryToEntryPairs.get(entry.category).push(entry)
        }
        return categoryToEntryPairs
    }

    getAudioEntries(category: string): AudioEntryPair[] {
        return this._getCategoryToEntryPairs().get(category)
    }
}

export { Database }
