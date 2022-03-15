import React, { useContext } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { DbContext } from '../../store/contexts/mytestcontext'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'

function PlayerScreen({ route, navigation }) {

    const { db } = useContext(DbContext)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Text>Player cards goes here</Text>
                {/* <AudioCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                /> */}
            </ScrollView>
            <AudioFooter user={db.getUser()} audioEntries={route.params.audioEntries} />
        </View>
    )
}

export default PlayerScreen
