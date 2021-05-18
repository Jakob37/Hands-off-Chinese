import React from 'react';
import {
    Text, View
} from 'react-native';

const Header = ({header}) => {
    return (
        <View>
            <Text style={{ 
                fontSize: 30, 
                textAlign: "center", 
                paddingTop: 20, 
                paddingBottom: 20 
            }}>{header}</Text>
        </View>
    );
}

export { Header };
