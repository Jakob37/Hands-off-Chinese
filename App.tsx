import Amplify from 'aws-amplify'
import React, { useState } from 'react'
import MainScreen from './src/screens/mainscreen'
import awsconfig from './src/custom-aws-exports'
import {
    PausedIdsContext,
    ShownIdsContext,
    DbContext,
} from './store/contexts/mytestcontext'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CardScreen from './src/screens/cardscreen'

// Analytics is explicitly disabled to prevent a warning according to following:
// https://github.com/aws-amplify/amplify-js/issues/5918
Amplify.configure({
    ...awsconfig,
    Analytics: {
        disabled: true,
    },
})

import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth'
import { HocDb } from './src/backend/database'

const Stack = createNativeStackNavigator()

// let db: HocDb = new HocDb()

const App = ({ _signOut, _user }) => {
    const [pausedIds, setPausedIds] = useState([])
    const [shownIds, setShownIds] = useState([])
    const [db, setDb] = useState(new HocDb())

    return (
        <PausedIdsContext.Provider
            value={{
                pausedIds,
                setPausedIds: setPausedIds,
            }}
        >
            <ShownIdsContext.Provider value={{ shownIds, setShownIds }}>
                <DbContext.Provider value={{ db, setDb }}>
                    <NavigationContainer>
                        <Stack.Navigator>
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
                </DbContext.Provider>
            </ShownIdsContext.Provider>
        </PausedIdsContext.Provider>
    )
}

// export default App
export default withAuthenticator(App)
