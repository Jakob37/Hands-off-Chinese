import React, { Component, useEffect } from "react";
import { View, Text, Button } from "react-native";

import Amplify, { Storage } from 'aws-amplify';

const listEntries = ['Entry 1', 'Entry 2', 'Entry 3'];

/**
 * @returns string[]
 */
const retrieveEntriesFromS3 = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
    return listResult.filter((result) => result.key != '').map((result) => result.key);
    // return ['updated1', 'updated2', 'updated3'];
}

const ListS3Content = () => {

    const [list, setList] = React.useState(['[Placeholder]']);

    // useEffect(() => {
    //     retrieveEntriesFromS3().then(returnedList => setList(returnedList));
    // })

    return (
        <View>
            <Button
                onPress={() => {
                    retrieveEntriesFromS3().then(returnedList => setList(returnedList));
                }}
                title = "Update S3 list"
            />
            <View>
                {list.map((entry) => <Text key={entry}>{entry}</Text>)}
                {/* {listEntries.map((entry) => <Text key={entry}>{entry}</Text> )} */}
            </View>
        </View>
    );
}

export { ListS3Content };
