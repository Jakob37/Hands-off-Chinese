import Amplify, { Storage } from 'aws-amplify'
import React, { useState } from 'react'
import MainScreen from './mainscreen'
import awsconfig from './src/aws-exports'
import {
    PausedIdsContext,
    ShownIdsContext
} from './store/contexts/mytestcontext'

// FIXME: Leave Amplify
Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

const App: React.FunctionComponent = () => {
    const [pausedIds, setPausedIds] = useState([])
    const [shownIds, setShownIds] = useState([])

    return (
        <PausedIdsContext.Provider
            value={{
                pausedIds,
                setPausedIds: setPausedIds,
            }}
        >
            <ShownIdsContext.Provider value={{ shownIds, setShownIds }}>
                <MainScreen />
            </ShownIdsContext.Provider>
        </PausedIdsContext.Provider>
    )
}

export default App
