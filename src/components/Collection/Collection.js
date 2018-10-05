import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

export default class Collection extends Component {

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => this.props.navigation.navigate('NewCollection')} title="Add new collection" />
      </View>
    );
  }
}
