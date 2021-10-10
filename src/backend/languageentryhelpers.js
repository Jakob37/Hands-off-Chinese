import { getMetaByCategory } from "./apicalls"
import { LanguagePair } from "./languageentry"

/**
 * @typedef {import('./apicalls.js').MetaObj} MetaObj
 */

/**
 * @param {string} category
 * @returns {Promise<[string,string,string,string][]>}
 */
 const getAudioListForCategory = async (category) => {
    const categoryEntries = await listCategory(category)
    console.log(categoryEntries)

    /** @type {Map<string,LanguagePair>} */
    const idToLanguagePair = new Map()

    for (const categoryEntry of categoryEntries) {
        const languagePair = idToLanguagePair.get(categoryEntry.id)
        if (languagePair != null) {
            languagePair.addEntry(categoryEntry)
        } else {
            const newPair = new LanguagePair(categoryEntry.id)
            newPair.addEntry(categoryEntry)
            idToLanguagePair.set(categoryEntry.id, newPair)
        }
    }

    const validPairs = Array.from(idToLanguagePair.values()).filter((pair) =>
        pair.isValid()
    )
    const returnPairs = validPairs.map((validPair) =>
        validPair.getFourStrings()
    )
    return returnPairs
}

/**
 * @param {string} category
 * @returns {Promise<import("src/apicalls").MetaObj[]>}
 */
 const listCategory = async (category) => {
    const result = await getMetaByCategory()
    return result.get(category)
}

export { getAudioListForCategory, listCategory };
