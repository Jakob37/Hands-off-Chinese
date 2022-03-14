import React from 'react'
import { HocDb } from '../../src/backend/database'

// const pausedIds: string[] = []
const PausedIdsContext = React.createContext({
    pausedIds: [] as string[],
    setPausedIds: (ids: string[]) => {},
})

const ShownIdsContext = React.createContext({
    shownIds: [] as string[],
    setShownIds: (ids: string[]) => {},
})

const DbContext = React.createContext({
    db: new HocDb(),
    setDb: (db: HocDb) => {}
})

export { PausedIdsContext, ShownIdsContext, DbContext }
