const getTimestamp = (): string => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, '')
}

function getRandomFromArray<V>(items: V[]): V {
    var item = items[Math.floor(Math.random() * items.length)]
    return item
}

function removeFromArray<V>(arr: V[], removeValue: V): V[] {
    const arrWithoutVal = []
    for (const currValue of arr) {
        if (currValue != removeValue) {
            arrWithoutVal.push(currValue)
        }
    }
    return arrWithoutVal
}

function toggleEntryInArray<V>(sourceIds: V[], id: V): V[] {
    let updatedArr
    if (!sourceIds.includes(id)) {
        updatedArr = Array.from(sourceIds)
        updatedArr.push(id)
    } else {
        updatedArr = removeFromArray(Array.from(sourceIds), id)
    }
    return updatedArr
}

function upperCaseFirst(str: string): string {
    return str[0].toUpperCase() + str.slice(1)
}

export {
    getTimestamp,
    getRandomFromArray,
    removeFromArray,
    toggleEntryInArray,
    upperCaseFirst,
}
