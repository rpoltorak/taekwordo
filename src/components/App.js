
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import MainMenu from './MainMenu';
import NewGame from './NewGame';
import Game from './Game';
import Collection from './Collection';
import Shop from './Shop';
import Settings from './Settings';

const RootStack = createStackNavigator(
  {
    MainMenu,
    NewGame,
    Game,
    Collection,
    Shop,
    Settings
  },
  {
    initialRouteName: 'MainMenu',
    navigationOptions: {
      header: null
    }
  }
);
export default class App extends Component {
  render() {
    return <RootStack />;
  }
}