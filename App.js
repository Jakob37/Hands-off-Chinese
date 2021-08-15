import React from "react";
import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { PlayDirectlyFromS3 } from "./components/aws/PlayDirectlyFromS3";
import { ListS3Content } from "./components/aws/ListS3Content";


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView>
                <StatusBar barStyle={"light-content"} />
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <Header header="Hands-off Chinese"></Header>
                    {/* <Menu></Menu> */}
                    {/* <AudioPlayerCard key="audioPlayer" /> */}
                    <PlayDirectlyFromS3 />
                    <ListS3Content />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default App;
