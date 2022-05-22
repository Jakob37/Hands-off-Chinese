import Amplify from 'aws-amplify'
import React, { useState } from 'react'
import MainScreen from './src/screens/mainscreen'
import awsconfig from './src/custom-aws-exports'
import {
    PausedIdsContext,
    ShownIdsContext,
    DbContext,
    AudioPlayerContext,
    FlaggedIdsContext,
} from './store/contexts/contexts'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AudioCardScreen from './src/screens/audiocardscreen'
import PlayerScreen from './src/screens/playerscreen'

import { Auth } from '@aws-amplify/auth'

// Analytics is explicitly disabled to prevent a warning according to following:
// https://github.com/aws-amplify/amplify-js/issues/5918
Amplify.configure({
    ...awsconfig,
    Analytics: {
        disabled: true,
    },
})
Auth.configure(awsconfig)

// FIXME: Why is this order needed? Does the db has excess dependencies here?
import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth'
import { HocDb } from './src/backend/database'
import { NAVIGATION } from './src/screens/navigationutils'
import { AudioPlayer } from './src/audio/AudioPlayer'
import { ThemeProvider } from 'react-native-elements'
import { sc } from './src/uicomponents/style'

const Stack = createNativeStackNavigator()

const theme = {
    Button: {
        titleStyle: {
            color: 'white',
        },
        buttonStyle: {
            backgroundColor: sc.colors.green,
        },
    },
}


const App = ({ _signOut, _user }) => {
    const [pausedIds, setPausedIds] = useState([])
    const [shownIds, setShownIds] = useState([])
    const [db, setDb] = useState(new HocDb())
    const [audioPlayer, setAudioPlayer] = useState(new AudioPlayer())
    const [flaggedIds, setFlaggedIds] = useState([])

    return (
        <PausedIdsContext.Provider
            value={{
                pausedIds,
                setPausedIds: setPausedIds,
            }}
        >
            <ShownIdsContext.Provider value={{ shownIds, setShownIds }}>
                <DbContext.Provider value={{ db, setDb }}>
                    <AudioPlayerContext.Provider
                        value={{ audioPlayer, setAudioPlayer }}
                    >
                        <FlaggedIdsContext.Provider
                            value={{ flaggedIds, setFlaggedIds }}
                        >
                            <ThemeProvider theme={theme}>
                                <NavigationContainer>
                                    <Stack.Navigator>
                                        <Stack.Screen
                                            name={NAVIGATION.main}
                                            component={MainScreen}
                                            options={{
                                                title: 'Categories',
                                            }}
                                        />
                                        <Stack.Screen
                                            name={NAVIGATION.audioList}
                                            options={{ title: 'Audio entries' }}
                                            component={AudioCardScreen}
                                        />
                                        <Stack.Screen
                                            name={NAVIGATION.audioPlayer}
                                            options={{ title: 'Audio player' }}
                                            component={PlayerScreen}
                                        />
                                    </Stack.Navigator>
                                </NavigationContainer>
                            </ThemeProvider>
                        </FlaggedIdsContext.Provider>
                    </AudioPlayerContext.Provider>
                </DbContext.Provider>
            </ShownIdsContext.Provider>
        </PausedIdsContext.Provider>
    )
}

// export default App
export default withAuthenticator(App)
