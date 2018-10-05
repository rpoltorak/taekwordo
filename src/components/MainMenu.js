import React, { Component } from 'react';
import { BackHandler, Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class Collection extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
        <Text style={{ fontSize: 30, color: '#FF0000', marginBottom: 50 }}>Taekwordo</Text>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('NewGame')}>
          <Text style={styles.text}>New Game</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('Collection')}>
          <Text style={styles.text}>Edit Collection</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('Shop')}>
          <Text style={styles.text}>Shop</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('Settings')}>
          <Text style={styles.text}>Settings</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => { BackHandler.exitApp(); }}>
          <Text style={styles.text}>Exit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25
  }
});
