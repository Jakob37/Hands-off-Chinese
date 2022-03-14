import React, { useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { DbContext } from '../../store/contexts/mytestcontext'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'

function CardScreen({ route, navigation }) {

    const { db } = useContext(DbContext)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <AudioCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>
            <AudioFooter user={db.getUser()} audioEntries={route.params.audioEntries} />
        </View>
    )
}

export default CardScreen
