import React, { Component } from 'react';
import { Button, FlatList, Text, TextInput, TouchableHighlight, View } from 'react-native';

import categories from '../../categories';
import items from '../../items';

export default class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameSet: false,
      items: [],
      categories: categories.reduce(function(map, category) {
        map[category.key] = false;
        return map;
      }, {})
    };
  }

  toggleCategory = category => {
    this.setState({
      categories: Object.assign({}, this.state.categories, {
        [category]: !this.state.categories[category]
      })
    })
  }

  render() {
    if (this.state.nameSet) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {categories.map(category => (
              <View key={category.key}>
                <TouchableHighlight onPress={() => this.toggleCategory(category.key)}>
                  <Text>{category.name}</Text>
                </TouchableHighlight>
                {this.state.categories[category.key] && <FlatList
                  keyExtractor={(item, index) => item.name}
                  data={items[category.key]}
                  renderItem={({item}) => (
                    <Text>{item.name}</Text>
                  )}
                />}
              </View>
            )
          )}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          style={{ height: 40, width: 200 }}
          placeholder="Name of collection"
          onChangeText={(name) => this.setState({ name })}
        />
        <Button
          onPress={() => this.setState({ nameSet: true })}
          title="Next"
          disabled={!this.state.name}
        />
        <Text>{this.state.name}</Text>
      </View>
    );
  }
}
