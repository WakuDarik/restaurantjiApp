import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, Button, Image } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';

export default class DrawerScreen extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center", }}>
          <Image
            style={{ width: "95%", height: 40, paddingBottom: 20, paddingTop: 10, paddingLeft: 5, paddingRight: 5, }}
            source={require('../img/logo-rest.png')}
          />
        </View>

        <View>
          <DrawerItems style={{ width: 100 }} {...this.props} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 25,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menuItem: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  headerContainer: {
    height: 150,
  },
  headerText: {
    color: '#fff8f8',
  },
  screenContainer: {
    paddingTop: 20,
    width: '100%',
  },
  screenStyle: {
    height: 30,
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  screenTextStyle: {
    fontSize: 20,
    marginLeft: 20,
    textAlign: 'center'
  },
  selectedTextStyle: {
    fontWeight: 'bold',
    color: '#00adff'
  },
  activeBackgroundColor: {
    backgroundColor: 'grey'
  }
});
