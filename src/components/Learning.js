import React, { Component } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import Voice from 'react-native-voice';
import KeepAwake from 'react-native-keep-awake';

import Video from 'react-native-video';

import game from '../game';
import categories from '../categories';

export default class Game extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    // const category = navigation.getParam('category');
    const category = categories[0];

    this.state = {
      category: category,
      height: Dimensions.get('window').height,
      started: false,
      interval: null,
      position: -150,
      activeIndex: 0,
      items: game.getShuffledArray(category.key),
      speechResults: [],
      points: 0,
      life: 3,
      end: false,
      counter: 3,
      recognizing: false,
      mode: 'learning',
      playedSound: false
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  componentDidMount() {
    const interval = setInterval(() => {
      if (this.state.counter <= 1) {
        clearInterval(interval);

        this.start();
      }

      this.setState({
        counter: this.state.counter - 1
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    console.log('onSpeechStart', e);
  }

  onSpeechRecognized(e) {
    console.log('onSpeechRecognized', e);
  }

  onSpeechEnd(e) {
    console.log('onSpeechEnd', e);
  }

  onSpeechError(e) {
    console.log('onSpeechError', e);
  }

  onSpeechResults(e) {
    console.log('onSpeechResults', e);

    if (this.state.mode === 'playing') {
      this.setState({
        speechResults: e.value.map(item => item.toLowerCase())
      });
    }

    this.startRecognizing();
  }

  onSpeechPartialResults(e) {
    console.log('onSpeechPartialResults', e);
  }

  onSpeechVolumeChanged(e) {
    console.log('onSpeechVolumeChanged', e);
  }

  async startRecognizing(e) {
    try {
      if (!this.state.recognizing) {
        await this.setState({ recognizing: true });
        await Voice.start('en-US');
      }

    } catch (e) {
      console.error(e);
    }
  }

  async stopRecognizing(e) {
    try {
      await this.setState({ recognizing: false });
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  renderAudio = () => {
    if (this.state.playedSound) {
      const activeItem = this.state.items[this.state.activeIndex];

      return (
        <Video source={activeItem.sound}
          ref={ref => this.player = ref}
          onError={error => Alert.alert(JSON.stringify(error))}
          audioOnly={true}
          style={styles.backgroundVideo}
        />
      );
    }
  }

  async initGameLoop() {
    await this.setState({
      started: true
    });

    if (this.state.mode === 'playing') {
      await this.startRecognizing();
    }

    this.interval = setInterval(async () => {
      const activeItem = this.state.items[this.state.activeIndex];

      if (this.state.mode === 'learning') {
        if (this.state.position >= this.state.height) {
          clearInterval(this.interval);

          this.setState({
            position: -150,
            mode: this.state.mode === 'playing' ? 'learning' : 'playing',
            playedSound: false
          });

          this.initGameLoop();
          return;
        }

        if (!this.state.playedSound && this.state.position >= this.state.height * 0.2) {
          this.setState({
            playedSound: true
          });
        }

        this.setState({
          position: this.state.position + 1
        });
      } else {
        if (this.state.position < this.state.height) {

          if (this.state.speechResults.toString().includes(activeItem.name.toLowerCase())) {
            clearInterval(this.interval);

            const nextIndex = this.state.activeIndex + 1;

            if (nextIndex >= this.state.items.length) {
              await this.setState({
                points: this.state.points + 10,
                end: true
              });

              this.stopRecognizing();
              return;
            } else {
              await this.setState({
                position: -150,
                points: this.state.points + 10,
                activeIndex: nextIndex,
                mode: 'learning',
                speechResults: []
              });

              this.initGameLoop();
            }
          } else {
            await this.setState({
              position: this.state.position + 1
            });
          }
        } else {
          clearInterval(this.interval);

          await this.setState({
            life: this.state.life - 1,
            activeIndex: this.state.activeIndex + 1,
            position: -150,
            end: this.state.life <= 1,
            mode: 'learning',
            speechResults: []
          });

          this.initGameLoop();
        }
      }
    }, 10);
  }

  async start() {
    this.setState({
      started: false,
      interval: null,
      position: -150,
      activeIndex: 0,
      items: game.getShuffledArray(this.state.category.key),
      speechResults: [],
      points: 0,
      life: 3,
      end: false,
      mode: 'learning'
    });

    await this.initGameLoop();
  }

  renderMainScene() {
    const activeItem = this.state.items[this.state.activeIndex];

    if (!activeItem) {
      return (<Text>{this.state.activeIndex}</Text>);
    }

    if (this.state.mode === 'learning') {
      return (
        <View style={styles.container}>
          <Image
            style={[styles.word, { top: this.state.position }]}
            source={activeItem.image}
          />
          {this.renderAudio()}
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Image
          style={[styles.word, { top: this.state.position }]}
          source={activeItem.image}
        />
        <Text>{this.state.mode}</Text>
        <Text style={styles.text}>Points: {this.state.points}</Text>
        <View style={styles.life}>
          {[...Array(this.state.life)].map((item, i) =>
            <Image
              style={styles.heart}
              source={require('../../assets/images/ui/heart.png')}
              key={i}
            />
          )}
        </View>
        <Text style={styles.active}>{activeItem.name}</Text>
        <Text>{JSON.stringify(this.state.speechResults)}</Text>
        <KeepAwake />
      </View>
    );
  }

  renderStartScene() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Category: {this.state.category.name}</Text>
        <Text style={styles.text}>Get ready!</Text>
        <Text style={styles.text}>{this.state.counter}</Text>
      </View>
    );
  }

  renderEndScene() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.state.life <= 0 ? 'Game over!' : 'You win!'}</Text>
        <Text style={styles.text}>Category: {this.state.category.name}</Text>
        <Text style={styles.text}>Points: {this.state.points}</Text>
        <Button
          onPress={() => this.props.navigation.navigate('NewGame')}
          title="Continue"
        />
      </View>
    );
  }

  render() {
    if (this.state.end) {
      return this.renderEndScene();
    }

    return this.state.started
      ? this.renderMainScene()
      : this.renderStartScene();
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  active: {
    fontSize: 40,
    color: '#FF0000'
  },
  text: {
    fontSize: 30
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  word: {
    width: 100,
    height: 100,
    margin: 10,
    position: 'absolute',
    top: 0
  },
  life: {
    flexDirection: 'row'
  },
  heart: {
    width: 50,
    height: 50
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
