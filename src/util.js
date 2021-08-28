/**
 * @returns {string}
 */
const getTimestamp = () => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, "")
}

export { getTimestamp };
