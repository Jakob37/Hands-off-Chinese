import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { AudioPaths } from "./components/AudioPaths";
import TrackPlayer from 'react-native-track-player';

import {
  Colors,
  Header,
} from "react-native/Libraries/NewAppScreen";

import { AudioCard } from "./components/AudioCard";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { TrackPlayerWrapper } from "./components/TrackPlayer";
import Sound from "react-native-sound";

// console.log('Sound base', Sound.MAIN_BUNDLE);

// const audioPaths = AudioPaths.getAudioPaths();

const audioPaths = [];
for (let i = 1; i <= 12; i++) {
  audioPaths.push(new AudioPaths(`exercise${i}`))
}
// audioPaths.push(new AudioPaths("ilikeapples"));
// audioPaths.push(new AudioPaths("ilikeoranges"));
// audioPaths.push(new AudioPaths("ilikepears"));

// const trackPlayer = new TrackPlayerWrapper();
// trackPlayer.init();

// console.log(audioPaths);

const App = () => {
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={"light-content"} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: Colors.white,
          }}
        />
        {audioPaths.map((audioPaths) => (
          <AudioCard
            label={audioPaths.label}
            english={audioPaths.english}
            chinese={audioPaths.chinese}
            key={audioPaths.label}
          ></AudioCard>
        ))}
        <AudioPlayerCard key="audioPlayer" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
