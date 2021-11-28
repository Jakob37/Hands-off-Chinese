const getTimestamp = (): string => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, "")
}

function getRandomFromArray<V>(items: V[]): V {
    var item = items[Math.floor(Math.random() * items.length)]
    return item
}

export { getTimestamp, getRandomFromArray }
