import React, { Component } from 'react';
import { Image, TouchableHighlight } from 'react-native';
import { Accordion, View, Button, Body, Title, Container, Header, Content, List, Left, Right, Icon, ListItem, Text } from 'native-base';


import categories from '../categories';
import items from '../items';

export default class Collection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: categories.map(category => Object.assign({}, category, { title: category.name }))
    }
  }

  renderContent = (category) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        {items[category.key].map(item => (
          <TouchableHighlight key={item.name} onPress={() => {}}>
            <Image
              style={{ width: 50, height: 50 }}
              source={item.image}
            />
          </TouchableHighlight>
        ))}
      </View>
    );
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
            <Title>Gallery</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <Accordion
            dataArray={this.state.categories}
            icon="add"
            expandedIcon="remove"
            renderContent={this.renderContent}
          />
        </Content>
      </Container>
    );
  }
}
