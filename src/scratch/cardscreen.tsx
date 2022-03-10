import React, { Component } from 'react'
import { Button, View, Text, ScrollView } from 'react-native'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'
// import { createStackNavigator, createAppContainer } from 'react-navigation'

function CardScreen({ route, navigation }) {

    return (
        <View style={{ flex: 1 }}>
            {/* <Text>Navigation end-point</Text>
            <Text>
                Params: {JSON.stringify(Object.keys(route.params), null, 2)}
            </Text>
            <Text>
                Audio entries:{' '}
                {JSON.stringify(
                    route.params.audioEntries.map((entry) => entry.id),
                    null,
                    2
                )}
            </Text>
            <Text>Navigation: {JSON.stringify(navigation, null, 2)}</Text> */}
            <ScrollView>
                <AudioCardList listEntries={route.params.audioEntries} />
            </ScrollView>
            <AudioFooter
                audioEntries={[]}
                // audioEntries={audioEntries}
                db={null}
                // db={db}
            />
        </View>
    )
}

export { CardScreen }
