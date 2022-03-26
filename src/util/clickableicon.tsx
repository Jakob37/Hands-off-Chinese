import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
Icon.loadFont()

interface ClickableIconInterface {
    icon: string
    size: number
    color: string
    clickCallback: () => void
    iconStyle: Record<string, string | number>
    containerStyle: Record<string, string | number>
}

const ClickableIcon = (param: ClickableIconInterface) => {
    return (
        <>
            <TouchableOpacity
                onPress={param.clickCallback}
                style={param.containerStyle}
            >
                <Icon
                    name={param.icon}
                    size={param.size}
                    color={param.color}
                    style={param.iconStyle}
                ></Icon>
            </TouchableOpacity>
        </>
    )
}

export default ClickableIcon
