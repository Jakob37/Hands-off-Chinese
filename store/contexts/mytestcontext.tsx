import React from 'react'

const pausedIds: string[] = []
const PausedIdsContext = React.createContext({
    pausedIds,
    setPausedIds: (ids: string[]) => {},
})

const shownIds: string[] = []
const ShownIdsContext = React.createContext({
    shownIds,
    setShownIds: (ids: string[]) => {},
})

export { PausedIdsContext, ShownIdsContext }
