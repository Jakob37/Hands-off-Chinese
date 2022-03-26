import React from 'react'
import { Button } from 'react-native-elements'
import { sc } from './style'

const FooterButton = (param) => {
    return <Button onPress={param.onPress} title={param.children}></Button>
}

const FoldableMenuButton = (param) => {
    return (
        <Button
            onPress={param.onPress}
            title={param.title}
            containerStyle={{ marginBottom: sc.componentMargins.small }}
        ></Button>
    )
}

export { FooterButton, FoldableMenuButton }
