import React, { Component } from 'react';
import { Picker, View } from 'react-native';
import { Left, Right, Icon, Button, Body, Container, Header, Content, Text } from 'native-base';

import categories from '../categories';

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: categories[0].key
    };
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MainMenu')}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontSize: 30 }}>Taekwordo {this.state.category.name}</Text>
          </Body>
          <Right></Right>
        </Header>
        <Content style={{ marginTop: 10 }}>
          <View style={{ alignSelf: 'center' }}>
            <Picker
              selectedValue={this.state.category}
              onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}
            >
              {categories.map(category =>
                <Picker.Item key={category.key} label={category.name} value={category.key} />
              )}
            </Picker>
            <Button
              full
              onPress={() => this.props.navigation.navigate('Game', {
                category: categories.find(category => category.key === this.state.category)
              })}
            >
              <Text>START GAME</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
