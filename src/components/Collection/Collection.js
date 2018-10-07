import React, { Component } from 'react';
import { Button, Text, TouchableHighlight, View } from 'react-native';

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

  removeCollection = async (collectionName) => {
    const updatedCollections = this.state.collections.filter(({name}) => name !== collectionName);

    await storage.save('collections', updatedCollections);

    this.setState({
      collections: updatedCollections
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => this.props.navigation.navigate('NewCollection')} title="Add new collection" />
        {this.state.collections.map(collection => (
          <View key={collection.name}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('NewCollection', {
              collection
            })}>
              <Text>{collection.name}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.removeCollection(collection.name)}>
              <Text>-</Text>
            </TouchableHighlight>
          </View>
        ))}
      </View>
    );
  }
}
