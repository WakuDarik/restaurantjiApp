import React from "react";
import { createAppContainer } from 'react-navigation'

import Drawer from '../restoran/navigation/DrawerNav'


class App extends React.Component {
  render () {
    return  <Drawer />
  }
}

export default  createAppContainer(Drawer);
