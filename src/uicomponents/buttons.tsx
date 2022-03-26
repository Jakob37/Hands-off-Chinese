import React from "react";
import { Button } from "react-native-elements";

const FooterButton = (param) => {
    return (
        <Button onPress={param.onPress} title={param.children}></Button>
    )
}

export { FooterButton };
