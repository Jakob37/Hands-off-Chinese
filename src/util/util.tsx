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

    console.log('Start:', arr, 'End', arrWithoutVal, 'Remove val', removeValue)
    return arrWithoutVal
}

function toggleIdInStateArray(sourceIds: string[], id: string): string[] {
    let updatedArr
    if (!sourceIds.includes(id)) {
        updatedArr = Array.from(sourceIds)
        updatedArr.push(id)
    } else {
        updatedArr = removeFromArray(Array.from(sourceIds), id)
    }
    return updatedArr
}

export {
    getTimestamp,
    getRandomFromArray,
    removeFromArray,
    toggleIdInStateArray,
}
