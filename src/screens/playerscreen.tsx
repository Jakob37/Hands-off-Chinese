import React, { useContext } from 'react'
import { ScrollView, View, Text } from 'react-native'
import PlayerFooter from '../views/footers/playerfooter'
import { DbContext } from '../../store/contexts/mytestcontext'
import { PlayerCardList } from '../views/list/playercardlist'

function PlayerScreen({ route, navigation }) {

    const { db } = useContext(DbContext)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>
            <PlayerFooter user={db.getUser()} audioEntries={route.params.audioEntries} />
        </View>
    )
}

export default PlayerScreen
