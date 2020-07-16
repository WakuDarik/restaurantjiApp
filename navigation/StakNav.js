import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../view/HomeScreen";
import CategoriesScreen from "../view/Categories";

export default StachHome = createStackNavigator({
    screen1:{
        screen: HomeScreen,
        navigationOptions: () => ({
            title: 'home'
        })
    },
    screen2:{
        screen: CategoriesScreen,
        navigationOptions: () => ({
            title: 'Categories'
        })
    }
},{
    initialRouteName: 'screen1'
})