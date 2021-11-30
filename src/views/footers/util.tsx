import React from "react";
import { Text, TouchableOpacity } from "react-native";

const fontSize = 16

const FooterButton = (param) => {
    return (
        <TouchableOpacity onPress={param.onPress}>
            <Text style={{ fontSize }}>{param.children}</Text>
        </TouchableOpacity>
    )
}

export { FooterButton };
