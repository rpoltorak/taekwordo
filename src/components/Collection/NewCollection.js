import React, { Component } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native';

import storage from '../../storage';
import categories from '../../categories';
import items from '../../items';

export default class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameSet: false,
      items: [],
      categories: {},
      selectedItems: {}
    };
  }

  setName = async () => {
    const collections = await storage.load('collections') || [];
    const existingCollection = collections.find(({ name }) => name === this.state.name);

    if (existingCollection) {
      Alert.alert('Collection with this name already exists');
    } else {
      this.setState({
        nameSet: true
      });
    }
  }

  toggleCategory = category => {
    this.setState({
      categories: Object.assign({}, this.state.categories, {
        [category]: !this.state.categories[category]
      })
    });
  }

  toggleSelectedItem = name => {
    this.setState({
      selectedItems: Object.assign({}, this.state.selectedItems, {
        [name]: !this.state.selectedItems[name]
      })
    });
  }

  save = async () => {
    const collections = await storage.load('collections') || [];

    collections.push({
      name: this.state.name,
      items: this.state.selectedItems
    });

    await storage.save('collections', collections);

    this.props.navigation.navigate('Collection');
  }

  render() {
    if (this.state.nameSet) {
      return (
        <ScrollView style={{ marginTop: 50 }}>
          {categories.map(category => (
              <View key={category.key}>
                <TouchableHighlight onPress={() => this.toggleCategory(category.key)}>
                  <Text style={this.state.categories[category.key] ? { color: 'red', fontSize: 20 } : { fontSize: 20 }}>
                    {category.name}
                  </Text>
                </TouchableHighlight>
                {this.state.categories[category.key] && items[category.key].map(item => (
                  <TouchableHighlight key={item.name} onPress={() => this.toggleSelectedItem(item.name)}>
                    <Text style={this.state.selectedItems[item.name] ? { color: 'red', fontSize: 20 } : { fontSize: 20 }}>
                      {item.name} {this.state.selectedItems[item.name] ? '-' : '+'}
                    </Text>
                  </TouchableHighlight>
                ))}
              </View>
            )
          )}
          <Button
            onPress={this.save}
            title="Save"
            disabled={Object.keys(this.state.selectedItems).length === 0}
          />
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          style={{ height: 40, width: 200 }}
          placeholder="Name of collection"
          autoCorrect={false}
          onChangeText={(name) => this.setState({ name })}
        />
        <Button
          onPress={this.setName}
          title="Next"
          disabled={!this.state.name}
        />
      </View>
    );
  }
}
