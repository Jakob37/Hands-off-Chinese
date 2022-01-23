import React from 'react'

// const pausedIds: string[] = []
const PausedIdsContext = React.createContext({
    pausedIds: [] as string[],
    setPausedIds: (ids: string[]) => {},
})

const ShownIdsContext = React.createContext({
    shownIds: [] as string[],
    setShownIds: (ids: string[]) => {},
})

export { PausedIdsContext, ShownIdsContext }
