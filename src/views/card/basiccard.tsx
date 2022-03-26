import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, Text } from 'react-native-elements'

interface BasicCardProps {
    text: string
    action: () => void
}

const BasicCard = (props: BasicCardProps) => {
    return (

            <Card containerStyle={{marginVertical: 5}}>
                <TouchableOpacity onPress={props.action}>
                    <Text>{props.text}</Text>
                </TouchableOpacity>
            </Card>
    )
}


export { BasicCard }
