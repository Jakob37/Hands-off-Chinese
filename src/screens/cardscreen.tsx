import { Auth } from 'aws-amplify'
import React, { Component, useEffect, useState } from 'react'
import { Button, View, Text, ScrollView } from 'react-native'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'

function CardScreen({ route, navigation }) {
    const [currentUser, setCurrentUser] = useState('[Refresh to show email]')

    const setUserData = () => {
        Auth.currentAuthenticatedUser().then((currUser) => {
            console.log('Setting current user')
            setCurrentUser(currUser.attributes.email)
            console.log(currUser.attributes)
        })
    }
    useEffect(setUserData, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <AudioCardList
                    user={currentUser}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>
            <AudioFooter audioEntries={[]} db={null} />
        </View>
    )
}

export default CardScreen
