import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import Voice from 'react-native-voice';
import KeepAwake from 'react-native-keep-awake';

import game from '../game';

export default class Game extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    const category = navigation.getParam('category');

    this.state = {
      category: category,
      height: Dimensions.get('window').height,
      started: false,
      interval: null,
      position: 0,
      activeIndex: 0,
      items: game.getShuffledArray(category.key),
      speechResults: [],
      points: 0,
      life: 3,
      end: false,
      counter: 3
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

    this.setState({
      speechResults: e.value.map(item => item.toLowerCase())
    });

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
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async initGameLoop() {
    this.setState({
      started: true
    });

    await this.startRecognizing();

    this.interval = setInterval(() => {

      if (this.state.position < this.state.height) {
        const activeItem = this.state.items[this.state.activeIndex];

        if (this.state.speechResults.includes(activeItem.name.toLowerCase())) {
          clearInterval(this.interval);

          const nextIndex = this.state.activeIndex + 1;

          if (nextIndex >= this.state.items.length) {
            this.setState({
              points: this.state.points + 10,
              end: true
            });

            this.stopRecognizing();
            return;
          } else {
            this.setState({
              position: 0,
              points: this.state.points + 10,
              activeIndex: nextIndex
            });

            this.initGameLoop();
          }
        } else {
          this.setState({
            position: this.state.position + 1
          });
        }
      } else {
        clearInterval(this.interval);

        this.setState({
          life: this.state.life - 1,
          activeIndex: this.state.activeIndex + 1,
          position: 0,
          end: this.state.life <= 1
        });

        this.initGameLoop();
      }
    }, 10);
  }

  async start() {
    this.setState({
      started: false,
      interval: null,
      position: 0,
      activeIndex: 0,
      items: game.getShuffledArray(this.state.category.key),
      speechResults: [],
      points: 0,
      life: 3,
      end: false
    });

    await this.initGameLoop();
  }

  renderMainScene() {
    const activeItem = this.state.items[this.state.activeIndex];

    return (
      <View style={styles.container}>
        <Image
          style={[styles.word, { top: this.state.position }]}
          source={activeItem.image}
        />
        <Text style={styles.text}>Points: {this.state.points}</Text>
        <View style={styles.life}>
          {[...Array(this.state.life)].map((item, i) =>
            <Image
              style={styles.heart}
              source={require('../../assets/images/heart.png')}
              key={i}
            />
          )}
        </View>
        <Text style={styles.active}>{activeItem.name}</Text>
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
  }
});
