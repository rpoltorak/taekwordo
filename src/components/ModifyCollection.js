import React, { Component } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Accordion, Button, Body, Title, Container, Header, Content, List, Left, Item, Right, Icon, ListItem, Text, Input } from 'native-base';

import storage from '../storage';
import categories from '../categories';
import items from '../items';

export default class Collection extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    const collection = navigation.getParam('collection');

    this.state = {
      name: collection ? collection.name : '',
      nameSet: !!collection,
      categories: categories.map(category => (
        { title: category.name, key: category.key, items: items[category.key] })
      ),
      selectedItems: collection ? collection.items : {}
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
    const updatedCollections = collections.filter(({ name }) => name !== this.state.name);

    const items = Object.keys(this.state.selectedItems).reduce((result, key) => {
      if (this.state.selectedItems[key]) {
        result[key] = true;
      }
      return result;
    }, {});

    updatedCollections.push({
      name: this.state.name,
      items
    });

    await storage.save('collections', updatedCollections);

    this.props.navigation.navigate('Collection');
  }

  removeCollection = async () => {
    const collections = await storage.load('collections') || [];
    const updatedCollections = collections.filter(({name}) => name !== this.state.name);

    await storage.save('collections', updatedCollections);

    this.props.navigation.navigate('Collection');
  }

  renderContent = (category) => {
    return (
      <List
        key={Math.random()}
        dataArray={category.items}
        renderRow={item => (
          <ListItem
            noIndent
            style={this.state.selectedItems[item.name] ? { backgroundColor: '#ffff00' } : {}}
            onPress={() => this.toggleSelectedItem(item.name)}>
            <Text>{item.name}</Text>
          </ListItem>
        )}
      >
      </List>
    );
  }

  render() {
    if (this.state.nameSet) {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('Collection')}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>{this.state.name}</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.removeCollection}>
                <Icon name='trash' />
              </Button>
              <Button transparent onPress={this.save}>
                <Icon name='checkmark' />
              </Button>
            </Right>
          </Header>
          <Content>
            <Accordion
              dataArray={this.state.categories}
              icon="add"
              expandedIcon="remove"
              iconStyle={{ color: "green" }}
              renderContent={this.renderContent}
            />
            <Button
              onPress={this.save}
              title="Save"
              disabled={Object.keys(this.state.selectedItems).length === 0}
            />
          </Content>
        </Container>
      );
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('Collection')}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>New Collection</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <Item>
            <Input
              style={{ height: 40, width: 200 }}
              autoFocus={true}
              placeholder="Name of collection"
              autoCorrect={false}
              onChangeText={(name) => this.setState({ name })}
            />
          </Item>
          <Text></Text>
          <Button
            full
            onPress={this.setName}
            disabled={!this.state.name}
          >
            <Text>
              Next
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
