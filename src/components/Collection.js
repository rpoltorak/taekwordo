import React, { Component } from 'react';
import { Button, Body, Title, Container, Header, Content, List, Left, Right, Icon, ListItem, Text } from 'native-base';

import storage from '../storage';

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
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MainMenu')}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Collections</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('ModifyCollection')}>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>
        <Content>
          <List
            noIndent
            dataArray={this.state.collections}
            renderRow={collection => (
              <ListItem onPress={() => this.props.navigation.navigate('ModifyCollection', { collection })}>
                <Text>{collection.name}</Text>
              </ListItem>
            )}
          >
          </List>
        </Content>
      </Container>
    );
  }
}
