import { getMetaAsAudioEntries } from './apicalls'
import { AudioEntryPair } from './audioentry'

class HocDb {
    _idToEntry: Map<string, AudioEntryPair>
    _idToActive: Map<string, boolean>
    _user: string

    setUser(user: string): void {
        this._user = user
    }

    getUser(): string {
        return this._user
    }

    async initDatabase(userEmail: string, doneCallback: (db: HocDb) => void = (db: HocDb) => {}) {
        this._idToEntry = await getMetaAsAudioEntries(userEmail)
        this._idToActive = new Map()
        for (const id of Array.from(this._idToEntry.keys())) {
            this._idToActive.set(id, true)
        }
        doneCallback(this)
    }

    getIsActive(id: string): boolean {
        return this._idToActive.get(id)
    }

    toggleIsActive(id: string) {
        console.log('Toggling is active', id)
        this._idToActive.set(id, !this.getIsActive(id))
    }

    _getAllEntries(): AudioEntryPair[] {
        if (this._idToEntry == null) {
            return [];
        } else {
            return Array.from(this._idToEntry.values())
        }
    }

    pauseAll() {
        for (const id of Array.from(this._idToActive.keys())) {
            this._idToActive.set(id, false)
        }
    }

    getCategories(): string[] {
        const allCategories = new Set(
            this._getAllEntries().map((entry) => entry.category)
        )
        const categoriesArray = Array.from(allCategories)
        categoriesArray.sort()
        return categoriesArray
    }

    _getCategoryToEntryPairs(): Map<string, AudioEntryPair[]> {
        const allCategories = this.getCategories()
        if (allCategories.length == 0) {
            return new Map()
        }
        const categoryToEntryPairs = new Map()
        for (const category of allCategories) {
            categoryToEntryPairs.set(category, [])
        }

        for (const entry of this._getAllEntries()) {
            categoryToEntryPairs.get(entry.category).push(entry)
        }
        return categoryToEntryPairs
    }

    getAudioEntries(category: string): AudioEntryPair[] {
        return this._getCategoryToEntryPairs().get(category) || []
    }
}

export { HocDb }
