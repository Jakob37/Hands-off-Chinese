import { getAllMeta, getMetaAsAudioEntries } from "./apicalls"
import { AudioEntryPair } from "./audioentry"

class Database {
    audioEntries: Map<string, AudioEntryPair>
    _entryPairs: AudioEntryPair[]

    async initDatabase(
        doneCallback: (db: Database) => void = (
            db: Database
        ) => {}
    ) {
        this.audioEntries = await getMetaAsAudioEntries()
        this._entryPairs = Array.from(this.audioEntries.values())
        doneCallback(this)
    }

    getCategories(): string[] {
        const allCategories = new Set(this._entryPairs.map((entry) => entry.category))
        const categoriesArray = Array.from(allCategories);
        categoriesArray.sort()
        return categoriesArray
    }
}

// /** @type {Map<string,{english:MetaObj, chinese:MetaObj, active:boolean}>} */
// const idToEntry = new Map()
// /** @type {Map<string,Set<string>>} */
// const categoryToIds = new Map()

// getAllMeta().then((result) => {
//     for (const resultEntry of result) {
//         if (!idToEntry.get(resultEntry.id)) {
//             idToEntry.set(resultEntry.id, {
//                 english: null,
//                 chinese: null,
//                 active: true,
//             })
//         }

//         idToEntry.get(resultEntry.id)[resultEntry.language] =
//             resultEntry
//         if (!categoryToIds.has(resultEntry.category)) {
//             categoryToIds.set(resultEntry.category, new Set())
//         }
//         categoryToIds.get(resultEntry.category).add(resultEntry.id)
//     }

//     // setCategoryList(Array.from(categoryToIds.keys()))

//     const categoryWithCounts = Array.from(categoryToIds).map(
//         ([category, ids]) => `${category} (${ids.size})`
//     )

//     console.log('End of loading meta')
//     this.idToEntry = idToEntry;
//     this.categoryToIds = categoryToIds;
//     // setDisplayCategoryList(categoryWithCounts)
// })
// }
// }

// const entries = categoryToIds.get(category)
// const audioList = []
// for (const entryId of Array.from(entries)) {
//     const entries = idToEntry.get(entryId)
//     audioList.push([
//         entries.english.text,
//         entries.english.filename,
//         entries.chinese.text,
//         entries.chinese.filename,
//         entries.active,
//     ])
// }

export { Database }
