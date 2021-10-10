class LanguagePair {
    id
    /** @type {{text:string, filename:string}[]} */
    chinese = []
    /** @type {{text:string, filename:string}[]} */
    english = []

    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id
    }

    /**
     * @param {MetaObj} metaObj
     */
    addEntry(metaObj) {
        if (metaObj.language == "chinese") {
            this._addChinese(metaObj.text, metaObj.filename)
        } else {
            this._addEnglish(metaObj.text, metaObj.filename)
        }
    }

    /**
     * @param {string} text
     * @param {string} filename
     */
    _addChinese(text, filename) {
        this.chinese.push({ text, filename })
    }

    /**
     * @param {string} text
     * @param {string} filename
     */
    _addEnglish(text, filename) {
        this.english.push({ text, filename })
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        return this.chinese.length == 1 && this.english.length == 1
    }

    /**
     * @returns {[string,string,string,string]}
     */
    getFourStrings() {
        return [
            this.chinese[0].text,
            this.chinese[0].filename,
            this.english[0].text,
            this.english[0].filename,
        ]
    }
}

export { LanguagePair };
