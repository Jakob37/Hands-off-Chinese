import React from 'react'
import { AudioPlayer } from '../../src/audio/AudioPlayer'
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
    setDb: (db: HocDb) => {},
})

const AudioPlayerContext = React.createContext({
    audioPlayer: new AudioPlayer(),
    setAudioPlayer: (audioPlayer: AudioPlayer) => {},
})

const FlaggedIdsContext = React.createContext({
    flaggedIds: [],
    setFlaggedIds: (flaggedIds: string[]) => {},
})

export {
    PausedIdsContext,
    ShownIdsContext,
    DbContext,
    AudioPlayerContext,
    FlaggedIdsContext,
}
