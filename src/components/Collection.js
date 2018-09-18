import React, { Component } from 'react';
import { Text, View } from 'react-native';
// import { observer } from "mobx-react";
// import { observable } from "mobx";

// @observer
export default class Collection extends Component {
  // @observable boxVisible = true;

  toggleBox = () => {
    this.boxVisible = !this.boxVisible;
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={this.toggleBox} label="Edit Collection" />
      </View>
    );
  }
}
