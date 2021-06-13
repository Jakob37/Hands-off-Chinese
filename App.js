import React from "react";
import { SafeAreaView, ScrollView, StatusBar, View, Text } from "react-native";
import { AudioPaths } from "./components/AudioPaths";
import TrackPlayer from "react-native-track-player";

import { AudioCard } from "./components/AudioCard";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { audioLibraries } from "./components/Database";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { TestCard } from "./components/TestCard";

const audioPaths = audioLibraries.get("exam_revision_3").audioPaths;

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
                    <Menu></Menu>
                    {/* {audioPaths.map((audioPaths) => (
                        <AudioCard
                            label={audioPaths.label}
                            english={audioPaths.english}
                            chinese={audioPaths.chinese}
                            key={audioPaths.label}
                        ></AudioCard>
                    ))} */}
                    <AudioPlayerCard key="audioPlayer" />
                    <TestCard />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default App;
