import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { Accordion, View, Button, Body, Title, Container, Header, Content, List, Left, Right, Icon, ListItem, Text } from 'native-base';

import Video from 'react-native-video';

import categories from '../categories';
import items from '../items';

export default class Collection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: categories.map(category => Object.assign({}, category, { title: category.name })),
      activeItem: null,
      buffering: false
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
          <TouchableHighlight
            key={item.name}
            onPress={() => this.setState({ activeItem: item })}
            disabled={this.state.buffering && item.name !== this.state.activeItem.name  }
            style={{ opacity: this.state.buffering && item.name !== this.state.activeItem.name ? 0.5 : 1 }}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={item.image}
            />
          </TouchableHighlight>
        ))}
      </View>
    );
  }

  renderAudio = () => {
    if (this.state.activeItem) {
      return (
        <Video source={this.state.activeItem.sound}
          ref={ref => this.player = ref}
          onError={error => Alert.alert(JSON.stringify(error))}
          onBuffer={() => this.setState({ buffering: true })}
          onEnd={() => this.setState({ activeItem: null, buffering: false })}
          audioOnly={true}
          style={styles.backgroundVideo}
        />
      );
    }
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
          <Text>{this.state.activeItem ? this.state.activeItem.name : 'none'}</Text>
          <Accordion
            dataArray={this.state.categories}
            icon="add"
            expandedIcon="remove"
            renderContent={this.renderContent}
          />
        </Content>
        {this.renderAudio()}
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
