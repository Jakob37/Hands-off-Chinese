import Amplify, { Storage } from 'aws-amplify'
import React, { useState } from 'react'
import MainScreen from './mainscreen'
import awsconfig from './src/aws-exports'
import {
    PausedIdsContext,
    ShownIdsContext,
} from './store/contexts/mytestcontext'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CardScreen } from './src/scratch/cardscreen'

// FIXME: Leave Amplify
Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

const Stack = createNativeStackNavigator()

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
                <NavigationContainer>
                    <Stack.Navigator>
                        {/* <MainScreen /> */}
                        <Stack.Screen
                            name="Home"
                            component={MainScreen}
                            options={{ title: 'Hands-off Chinese' }}
                        />
                        <Stack.Screen
                            name="Test"
                            options={{ title: 'Audio entries ' }}
                            component={CardScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ShownIdsContext.Provider>
        </PausedIdsContext.Provider>
    )
}

export default App
