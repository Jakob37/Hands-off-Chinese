import Amplify from 'aws-amplify'
import React, { useState } from 'react'
import MainScreen from './mainscreen'
import awsconfig from './src/custom-aws-exports'
import {
    PausedIdsContext,
    ShownIdsContext,
} from './store/contexts/mytestcontext'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CardScreen } from './src/scratch/cardscreen'

Amplify.configure(awsconfig);

import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth'

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

export default withAuthenticator(App)
