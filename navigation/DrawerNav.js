
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../view/HomeScreen";
import Near from "../view/Near";
import ProfileScreen from "../view/ProfileScreen";
import SerchScreen from "../view/SerchScreen";
import Categori from "../view/Categori";
import Reviews from "../view/Reviews";
import DrawerScreen from '../view/DrawerScreen'

const StackHome = createStackNavigator({
    screen1: {
        screen: HomeScreen,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
            title: 'Home',
        })
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
            title: 'Shop',
            drawerLockMode: "locked-closed"
        })
    },
    Near: {
        screen: Near,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
            title: 'Restaurants nearby',
        })
    },
    Reviews: {
        screen: Reviews,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
        })
    },
    Serch: {
        screen: SerchScreen,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
        })
    },
    Categori: {
        screen: Categori,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
        })
    },

})


const StackCategories = createStackNavigator({
    Near: {
        screen: Near,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
            title: 'Restaurants nearby'
        })
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: () => ({
            headerStyle: { backgroundColor: '#51ab6d' },
            headerTintColor: 'white',
            title: 'Shop',
            drawerLockMode: "locked-closed"
        })
    },

})


export default Drawer = createDrawerNavigator({
    Home: {
        screen: StackHome,
    },
    Near: {
        screen: StackCategories,
        navigationOptions: {
            drawerLabel: "Restaurants nearby"
          }
      
    },

},
    {

        // define customComponent here
        contentComponent: DrawerScreen
    }
)