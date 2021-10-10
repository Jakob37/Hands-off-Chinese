/**
 * @returns {string}
 */
const getTimestamp = () => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, "")
}

/**
 * @template V
 * @param {V[]} items
 * @returns V
 */
function getRandomFromArray(items) {
    var item = items[Math.floor(Math.random() * items.length)]
    return item
}

export { getTimestamp, getRandomFromArray }
