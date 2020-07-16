import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
const Entities = require('html-entities').XmlEntities;

export default class SerchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, serverData: [] };
    this.offset = 0;
    this.lat = 0;
    this.lng = 0;
    this.arrayholder;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Serch"),
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack(null)}>
          <Icon
            name="md-arrow-round-back"
            style={{ fontSize: 30, color: "#fff" }}
          />
        </TouchableOpacity>
      ),
    };
  };
  async componentDidMount () {
    const { navigation } = this.props;
    try {
      const config = {
        method: "POST",
        body: JSON.stringify({ city_id: navigation.getParam('city_id', '0') })
      };
      const response = await fetch(
        "http://firstbankmi.com/git/restApp/getBiz.php?q=getBizNear&offset=0",
        config
      );
      // console.log(navigation.getParam('city_id', '0'));
      const responseJson = await response.json();
      this.offset = this.offset + 100;
      this.setState({
        isLoading: false,
        serverData: [...this.state.serverData, ...responseJson],
      });
    } catch (error) {
      console.error(error);
    }
  }
  renderFooter () {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.loadMore}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}
        >
          <Text style={styles.btnText}>Load More</Text>
          {this.state.fetching_from_server ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
  loadMore = () => {
    this.setState({ fetching_from_server: true }, async () => {
      const { navigation } = this.props;
      try {
        const config = {
          method: "POST",
          body: JSON.stringify({ city_id: navigation.getParam('city_id', '0') })
        };
        const response = await fetch(
          `http://firstbankmi.com/git/restApp/getBiz.php?q=getBizNear&offset=${this.offset}`,
          config
        );
        const responseJson = await response.json();
        this.offset = this.offset + 100;
        this.setState({
          isLoading: false,
          serverData: [...this.state.serverData, ...responseJson],
          //adding the new data with old one available in Data Source of the List
          fetching_from_server: false
          //updating the loading state to false
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  render () {


    const enities = new Entities();
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View
        style={{ flex: 1, paddingTop: 10, }}
      >
        {/* <Text style={styles.title}>lat: {this.lat}</Text>
                      <Text style={styles.title}>lng: {this.lng}</Text> */}
        <FlatList
          style={styles.listStyle}
          data={this.state.serverData}
          ListFooterComponent={this.renderFooter.bind(this)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.blogWrap}
              onPress={() =>
                this.props.navigation.navigate("Profile", {
                  itemId: item.business_id,
                  title: enities.decode(item.bz_name)
                })
              }>
              {/* <Text style={styles.title}>{item.title}</Text> */}
              <View style={styles.imgWrap}>
                {item.photo_name !== '' ? (
                  <Image
                    style={{
                      width: "100%",
                      height: 100,
                    }}
                    resizeMode="cover"
                    source={{
                      uri: `https://cdn.localdatacdn.com/${item.abbreviation}/${item.city_name.replace(/ /ig, '-')}/${item.business_id}/small/${item.photo_name}.jpg`
                    }}
                  />
                ) : (<Image
                  style={{
                    width: "100%",
                    height: 100,
                  }}
                  resizeMode="cover"
                  source={require("../img/no-img.png")}
                />
                  )}
              </View>
              <View style={{ width: "70%", justifyContent: "center" }}>
                <Text
                  style={{ color: "#51ab6d", fontSize: 25, paddingLeft: 5, }}

                >{enities.decode(item.bz_name)}</Text>
                <Text>{item.phone}</Text>
                <Text style={{ textAlign: "left" }}>{enities.decode(item.address)}</Text>
                <Text style={{ textAlign: "left" }}>Rating - {item.rating}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.business_id}
        />
      </View>
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
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imgWrap: {
    flex: 1,
    height: 150,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },
  title: {
    color: "#51ab6d",
    fontSize: 20
  },
  blogWrap: {

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#fff",
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    paddingBottom: 5,
    paddingTop: 5,
    zIndex: 2,
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
    paddingRight: 5,
    backgroundColor: "#82ca97",
    color: "#fff",
  },
  autocompleteContainer: {
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center"
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
    backgroundColor: "#82ca97",
    color: "#fff",
  },
  infoText: {
    textAlign: "center",
    fontSize: 16
  }
});
