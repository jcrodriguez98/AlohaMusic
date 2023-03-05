import React, { Component } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const ukulele = require('./assets/ukulele.png');

export default class App extends Component {
  state = {
     isPlaying: false
    ,volume: 1.0
    ,playbackInstance: null
    ,isBuffering: false
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = require('./assets/ukulele.mp3');
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Aloha Music</Text>
        <Image source={ukulele} style={styles.image} />
        <TouchableOpacity 
          style={styles.control}
          onPress={this.handlePlayPause}
        >
          {this.state.isPlaying ?
            <Feather name="pause" size={32} color="#563822" /> :
            <Feather name="play" size={32} color="#563822" />
          }
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    width: 300, 
    backgroundColor: '#da9547',
    alignItems: 'center',
    padding: 10,
    margin: 40,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center'
  },
  image: {
    height: 500,
    width: 300
  },
  control: {
    margin: 40
  }
});
