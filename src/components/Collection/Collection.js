import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import storage from '../../storage';

export default class Collection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collections: []
    };
  }

  componentDidMount = async () => {
    this.willFocusListener = this.props.navigation.addListener(
      'willFocus',
      async () => {
        const collections = await storage.load('collections') || [];
        this.setState({
          collections
        });
      }
    );
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => this.props.navigation.navigate('NewCollection')} title="Add new collection" />
        {this.state.collections.map(collection => <Text key={collection.name}>{collection.name}</Text>)}
      </View>
    );
  }
}
