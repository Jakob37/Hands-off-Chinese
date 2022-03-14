import { Auth } from 'aws-amplify'
import React, { Component, useContext, useEffect, useState } from 'react'
import { Button, View, Text, ScrollView } from 'react-native'
import { DbContext } from '../../store/contexts/mytestcontext'
import AudioFooter from '../views/footers/audiofooter'
import { AudioCardList } from '../views/list/audiocardlist'

function CardScreen({ route, navigation }) {
    // const [currentUser, setCurrentUser] = useState('[Refresh to show email]')

    // const setUserData = () => {
    //     Auth.currentAuthenticatedUser().then((currUser) => {
    //         console.log('Setting current user')
    //         setCurrentUser(currUser.attributes.email)
    //         console.log(currUser.attributes)
    //     })
    // }
    // useEffect(setUserData, [])

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
