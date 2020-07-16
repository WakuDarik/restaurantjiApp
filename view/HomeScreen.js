import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";

import Autocomplete from "react-native-autocomplete-input";
import jsonCity from "../city.json";

export default class HomeScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      shtat: [],
      query: "",
      menuOpen: false,
      latCity: 0,
      lngCity: 0,
      //Loading state used while loading more data
    };
    this.offset = 0;
    this.arrayholder;
  }

  navOptions
  static navigationOptions = ({ navigation }) => {

    navOptions = navigation;
    const { params = {} } = navigation.state;
    return {
      headerLeft: (
        <TouchableOpacity

          style={{ paddingLeft: 20 }}
          onPress={() => params._onHeaderEventControl()}
        >
          <Icon
            name="ios-menu"
            style={{ fontSize: 30, color: "#fff" }}
          />
        </TouchableOpacity>
      ),
    }
  }

  onHeaderEventControl () {
    const { params = {} } = navOptions.state;
    params._openNav()
  }

  componentDidMount () {
    this.props.navigation.setParams({
      _onHeaderEventControl: this.onHeaderEventControl,
      _openNav: () => { this.openDrawer() }
    })
    this.setState({
      isLoading: false,
    })
    const { results: shtat } = jsonCity;
    this.setState({ shtat });
  }

  openDrawer () {
    this.props.navigation.openDrawer()
  }

  handleMenu () {
    const { menuOpen } = this.state
    this.setState({
      menuOpen: !menuOpen
    })
  }


  findFilm (query) {
    //method called everytime when we change the value of the input
    if (query === "") {
      //if the query is null then return blank
      return [];
    }

    const { shtat } = this.state;
    //making a case insensitive regular expression to get similar value from the film json
    const regex = new RegExp(`${query.trim()}`, "i");
    //return the filtered film array according the query from the input
    return shtat.filter(shtat => shtat.city.search(regex) >= 0);
  }

  render () {
    const { query } = this.state;
    const shtat = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <SafeAreaView>
        <View
          style={{ paddingBottom: 25 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderColor: "#ccc", // if you need
              borderBottomWidth: 1,
              overflow: "hidden",
              shadowColor: "#24292e",
              shadowRadius: 10,
              shadowOpacity: 1,
              zIndex: 1
            }}
          >
            <Autocomplete
              style={{
                backgroundColor: "#82ca97",
                color: "#fff",
                fontSize: 18,
                paddingLeft: 5,
                paddingBottom: 5,
                paddingTop: 5,
                paddingRight: 5,
              }}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              //data to show in suggestion
              data={shtat.length === 1 && comp(query, shtat[0].city) ? [] : shtat}
              //default value if you want to set something in input
              defaultValue={query}
              /*onchange of the text changing the state of the query which will trigger
            the findFilm method to show the suggestions*/
              onChangeText={text => this.setState({ query: text.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '') })}
              placeholder="Find restaurants in the city"
              placeholderTextColor="#fff"
              renderItem={({ item }) => (
                //you can change the view you want to show in suggestion from here
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    this.setState({
                      query: `${item.city}, ${item.state}`,
                    })
                    this.props.navigation.navigate("Serch", {
                      title: `${item.city}, ${item.state}`,
                      city_id: item.city_id,
                    })
                  }
                  }
                >
                  <Text style={styles.itemText}>
                    {item.city}, {item.state}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => String(item.city_id)}
            />

          </View>

          <ScrollView>
            <View style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f8f8",
              paddingBottom: 45,
            }}>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Near", {
                    title: "Near"
                  })
                }>
                <ImageBackground source={require('../img/app_allrestaurants.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold", textAlign: 'center' }}>Restaurants nearby</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 33,
                    title: "Fast food"
                  })
                }>
                <ImageBackground source={require('../img/app_fastfood.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Fast Food</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: `34,43`,
                    title: "Burgers"
                  })
                }>
                <ImageBackground source={require('../img/app_burgers.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Burgers</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 36,
                    title: "Mexican"
                  })
                }>
                <ImageBackground source={require('../img/app_mexican.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Mexican</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 40,
                    title: "Bar & Grills"
                  })
                }>
                <ImageBackground source={require('../img/app_bar_n_grill.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Bar & Grills</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 42,
                    title: "American"
                  })
                }>
                <ImageBackground source={require('../img/app_diner.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>American</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: `46,47`,
                    title: "Sandwich Shops"
                  })
                }>
                <ImageBackground source={require('../img/app_sandwich_delis.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Sandwich Shops</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 48,
                    title: "Italian"
                  })
                }>
                <ImageBackground source={require('../img/app_italian.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Italian</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 54,
                    title: "Pizza"
                  })
                }>
                <ImageBackground source={require('../img/app_pizza.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Pizza</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 61,
                    title: "Chinese"
                  })
                }>
                <ImageBackground source={require('../img/app_chinese.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Chinese</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 68,
                    title: "Seafood"
                  })
                }>
                <ImageBackground source={require('../img/app_seafood.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Seafood</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: `183,185,2460,2466`,
                    title: "Coffee Shops"
                  })
                }>
                <ImageBackground source={require('../img/app_coffee.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Coffee Shops</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: `35,2464,2467`,
                    title: "Ice Cream"
                  })
                }>
                <ImageBackground source={require('../img/app_icecream_yogurt.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Ice Cream</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.blogWrap}
                onPress={() =>
                  this.props.navigation.navigate("Categori", {
                    categoriID: 1158,
                    title: "Vegan"
                  })
                }>
                <ImageBackground source={require('../img/app_vegan.jpg')} style={styles.imgbg}>
                  <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>Vegan</Text>
                </ImageBackground>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(4,4,4)",
    alignItems: "center",
    justifyContent: "center"
  },
  listStyle: {
    backgroundColor: "#f8f8f8",

  },
  imgWrap: {
    flex: 1,
    height: 150
  },
  title: {
    color: "#51ab6d",
    fontSize: 20
  },
  imgbg: {
    width: '100%', height: '100%', justifyContent: "center", alignItems: "center"
  },
  blogWrap: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    marginBottom: 25,
    width: "95%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden"
  },
  separator: {
    height: 0.5,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    paddingLeft: 5,
    paddingRight: 5
  },
  autocompleteContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 0
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center"
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2
  },
  infoText: {
    textAlign: "center",
    fontSize: 16
  }
});
