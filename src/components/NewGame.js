import React, { Component } from 'react';
import { Button, Picker, Text, View } from 'react-native';

import categories from '../categories';

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: categories[0]
    };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>
            Choose category
          </Text>
          <Picker
            selectedValue={this.state.category.name}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}>
            {categories.map(category =>
              <Picker.Item key={category.key} label={category.name} value={category} />
            )}
          </Picker>
          <Button
            onPress={() => this.props.navigation.navigate('Game', {
              category: this.state.category
            })}
            title="START GAME"
          />
      </View>
    );
  }
}
