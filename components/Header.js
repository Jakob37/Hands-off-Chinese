import React from 'react';
import {
    Text, View
} from 'react-native';
import { styles } from './Stylesheet';

const Header = ({header}) => {
    return (
        <View>
            <Text style={styles.header}>{header}</Text>
        </View>
    );
}

export { Header };
