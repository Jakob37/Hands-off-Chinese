import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import ClickableIcon from './clickableicon'
import { sc } from './style'

const FooterButton = (props) => {
    return <Button onPress={props.onPress} title={props.children}></Button>
}

const FoldableMenuButton = (props) => {
    return (
        <Button
            onPress={props.onPress}
            title={props.title}
            containerStyle={{ marginBottom: sc.componentMargins.small }}
        ></Button>
    )
}

interface FloatingActionButtonProps {
    iconColor?: string
    backgroundColor?: string
    icon: string
    onPress: () => void
    yPosition?: number
}
const FloatingActionButton = (props: FloatingActionButtonProps) => {
    return (
        <View
            style={{
                position: 'absolute',
                bottom:
                    sc.componentMargins.large +
                    props.yPosition *
                        (sc.componentMargins.large +
                            sc.iconSizes.large +
                            sc.iconPaddings.small),
                right: sc.componentMargins.large,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <ClickableIcon
                    iconColor={props.iconColor}
                    backgroundColor={props.backgroundColor}
                    icon={props.icon}
                    size={sc.iconSizes.large}
                    clickCallback={props.onPress}
                ></ClickableIcon>
            </View>
        </View>
    )
}
FloatingActionButton.defaultProps = {
    iconColor: sc.colors.white,
    backgroundColor: sc.colors.green,
    yPosition: 0,
}

export { FooterButton, FoldableMenuButton, FloatingActionButton }
