import React, { Component } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { Container, Header, Content, Button, Body, Text } from 'native-base';

export default class Collection extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Text style={{ fontSize: 30 }}>Taekwordo</Text>
          </Body>
        </Header>
        <Content style={{ marginTop: 10 }}>
          <Button full onPress={() => this.props.navigation.navigate('NewGame')} style={{ marginBottom: 5 }}>
            <Text>New Game</Text>
          </Button>
          <Button full onPress={() => this.props.navigation.navigate('Collection')} style={{ marginBottom: 5 }}>
            <Text>Collections</Text>
          </Button>
          <Button full onPress={() => this.props.navigation.navigate('Gallery')} style={{ marginBottom: 5 }}>
            <Text>Gallery</Text>
          </Button>
          {/* <Button full onPress={() => this.props.navigation.navigate('Shop')} style={{ marginBottom: 5 }}>
            <Text>Shop</Text>
          </Button> */}
          {/* <Button full onPress={() => this.props.navigation.navigate('Settings')} style={{ marginBottom: 5 }}>
            <Text>Settings</Text>
          </Button> */}
          <Button full onPress={() => { BackHandler.exitApp(); }}>
            <Text>Exit</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25
  }
});
