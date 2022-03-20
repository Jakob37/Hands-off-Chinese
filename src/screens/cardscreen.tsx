import React, { useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { DbContext } from '../../store/contexts/contexts'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'
import { AudioEntriesProps } from './navigationutils'

function CardScreen({ route, navigation }: AudioEntriesProps) {
    const { db } = useContext(DbContext)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <AudioCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>
            <AudioFooter
                navigation={navigation}
                user={db.getUser()}
                audioEntries={route.params.audioEntries}
            />
        </View>
    )
}

export default CardScreen
