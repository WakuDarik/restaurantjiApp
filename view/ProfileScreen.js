import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  ImageBackground,
  Linking,
  TouchableOpacity,
  Modal
} from "react-native";
const Entities = require('html-entities').XmlEntities;
import ImageViewer from 'react-native-image-zoom-viewer';

import Icon from 'react-native-vector-icons/Ionicons';



export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, serverData: [], modalVisible: false, images: [], imagesMenu: [] };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  static navigationOptions = ({ navigation }) => {

    return {
      drawerLockMode: 'locked-closed',
      title: navigation.getParam("title", "Restouran"),
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack(null)}>
          <Icon
            color='#517fa4'
            backgroundColor="#3b5998"
            name="md-arrow-round-back"
            style={{ fontSize: 30, color: "#fff", }
            }
          />
        </TouchableOpacity>
      ),
    };
  };

  _closeModal () {
    this.setState({ modalVisible: false });
    this.props.navigation.setParams({ shouldEnableGestures: true });
  }

  async componentDidMount () {
    const { navigation } = this.props;
    const id = navigation.getParam("itemId", "1");
    try {
      const response = await fetch(
        `http://firstbankmi.com/git/restApp/getBiz.php?q=getBizSolo&id=${id}`
      );
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        serverData: [...this.state.serverData, ...responseJson]
      });
    } catch (error) {
      console.error(error);
    }
    this.state.serverData.map((item, index) => (
      item[3].map((img, index) => (
        this.setState(state => ({
          images: state.images.concat({
            url: `https://localdatacdn.com/${img.abbreviation}/${img.city_name.replace(/ /ig, '-')}/${img.business_id}/original/${img.photo_name}.jpg`
          })
        }))
      )
      )
    ))

  }

  getWeekDay = date => {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return days[date.getDay()];
  };

  sheduleRender = (open, close, active = false) => {
    if (open === "Closed") {
      return <Text style={styles.style, active ? { color: "#51ab6d", fontWeight: "bold" } : null} selectable={true}>Colosed</Text>;
    } else if (open === "Open 24") {
      return <Text style={styles.sheduleItemText, active ? { color: "#51ab6d", fontWeight: "bold" } : null} selectable={true}>Open 24</Text>;
    } else {
      return (
        <>
          <Text style={active ? { color: "#51ab6d", fontWeight: "bold" } : null} selectable={true}>{open}</Text>
          <Text style={active ? ({ color: "#51ab6d", fontWeight: "bold" }) : null, styles.sheduleItemText} selectable={true}>-</Text>
          <Text style={active ? { color: "#51ab6d", fontWeight: "bold" } : null} selectable={true}>{close}</Text>
        </>
      );
    }
  };

  revievsStar = rating => {
    rating = (rating / 5) * 100;
    (5 / 5) * 100;
    return (
      <View style={{ width: `${rating}%`, overflow: "hidden" }}>
        <Image
          style={{
            width: 86,
            height: 26
          }}
          resizeMode="contain"
          source={{
            uri: `http://firstbankmi.com/images/stars/star-score.png`
          }}
        />
      </View>
    );
  };

  render () {
    const entities = new Entities();
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    let date = new Date();
    let dayNow = this.getWeekDay(date);
    let daysWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: 20, paddingLeft: 5, paddingRight: 5 }}
      >
        <ScrollView>
          {this.state.serverData.map((item, index) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.h1} selectable={true}>{entities.decode(item.name)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                {item[4].map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', paddingRight: 10 }}>
                    <Image source={require('../img/fork.png')}
                      style={{ width: 16, height: 16, tintColor: "#51ab6d", }}
                      resizeMode="contain"
                    />
                    <Text style={{ paddingLeft: 5 }} selectable={true}>
                      {entities.decode(item.name_categories)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                <Image source={require('../img/marker.png')}
                  style={{ width: 16, height: 16, tintColor: "#51ab6d", }}
                  resizeMode="contain"
                />
                <Text selectable={true}>{entities.decode(item.address)}</Text>
              </View>
              {item[0].map((days, index) => (
                daysWeek[days.day] === dayNow ? (
                  <View key={index} style={styles.sheduleItem}>

                    <Text style={{ marginRight: 20, fontSize: 16, fontWeight: "bold", color: "#51ab6d" }}>
                      {daysWeek[days.day]}
                    </Text>
                    <View
                      style={{ flexDirection: "row", flex: 1 }}
                    >
                      {this.sheduleRender(days.open, days.close, true)}
                    </View>
                  </View>
                ) : null))}

              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10, marginTop: 10, }}>
                {item.phone ? (
                  <TouchableOpacity
                    style={styles.headerIco}
                    onPress={() => { Linking.openURL(`tel:${item.phone}`); }}
                  >
                    <Image
                      style={{
                        width: 54,
                        height: 54,
                        marginBottom: 10,
                        tintColor: "#51ab6d",
                      }}
                      source={require('../img/phone-call.png')}
                    />
                    <Text style={{ color: "#51ab6d" }}>Call</Text>
                  </TouchableOpacity>) : null}
                {item.address ? (
                  <TouchableOpacity
                    style={styles.headerIco}
                    onPress={() => { Linking.openURL(`https://www.google.com/maps?daddr=${item.address}`); }}
                  >
                    <Image
                      style={{
                        width: 54,
                        height: 54,
                        marginBottom: 10,
                        tintColor: "#51ab6d",
                      }}
                      source={require('../img/traffic.png')}
                    />
                    <Text style={{ color: "#51ab6d" }}>In map</Text>
                  </TouchableOpacity>) : null}
                {item.website ? (
                  <TouchableOpacity
                    style={styles.headerIco}
                    onPress={() => Linking.openURL(item.website.split('?')[0])}
                  >
                    <Image
                      style={{
                        width: 54,
                        height: 54,
                        marginBottom: 10,
                        tintColor: "#51ab6d",
                      }}
                      source={require('../img/www.png')}
                    />
                    <Text style={{ color: "#51ab6d" }}>Web site</Text>
                  </TouchableOpacity>) : null}
              </View>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Ratings</Text>
              <ScrollView horizontal={true} >
                {item[1].map((ratings, index) => (
                  <View key={index} style={styles.ratingItem}>
                    <Image
                      style={{
                        width: 100,
                        height: 70
                      }}
                      resizeMode="cover"
                      source={{
                        uri: `http://firstbankmi.com/images/${ratings.rating_name}.gif`
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ fontSize: 18, marginRight: 8 }}>
                        {ratings.rating}
                      </Text>
                      <Image
                        style={{
                          width: 20,
                          height: 20
                        }}
                        resizeMode="cover"
                        source={{
                          uri: `http://firstbankmi.com/images/stars/star.png`
                        }}
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
              {item[5].length != 0 ?
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Tips</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {item[5].map((item, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        style={{ fontSize: 16, marginRight: 5, color: "#51ab6d" }} />
                      <Text >
                        {entities.decode(item)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              : null }
              {item[6].length != 0 ?
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>More info</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {item[6].map((item, index) => (
                      <View key={index} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                        <Icon
                          name="ios-checkmark-circle-outline"
                          style={{ fontSize: 16, marginRight: 5, color: "#51ab6d" }} />
                        <Text >
                          {entities.decode(item)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                : null}
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Hours</Text>
                {item[0].map((days, index) => (
                  daysWeek[days.day] === dayNow ? (
                    <View key={index} style={styles.sheduleItem, { paddingLeft: 10, flex: 1, flexDirection: "row" }}>
                      <Text style={{ marginRight: 20, flex: 1, fontSize: 16, color: "#51ab6d" }}>
                        {daysWeek[days.day]}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 2,
                        }}
                      >
                        {this.sheduleRender(days.open, days.close, true)}
                      </View>
                    </View>
                  ) :
                    <View key={index} style={styles.sheduleItem, { paddingLeft: 10, flex: 1, flexDirection: "row" }}>
                      <Text style={{ marginRight: 20, flex: 1, fontSize: 16, }}>
                        {daysWeek[days.day]}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 2,

                        }}
                      >
                        {this.sheduleRender(days.open, days.close)}
                      </View>
                    </View>))}
              </View>
              {item[3].length != 0 ?
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Photos</Text>
                  <ScrollView
                    horizontal>
                    {item[3].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          this.setModalVisible(true);
                        }}>

                        <Image style={{ width: 200, height: 200 }}
                          source={{ uri: `https://localdatacdn.com/${item.abbreviation}/${item.city_name.replace(/ /ig, '-')}/${item.business_id}/small/${item.photo_name}.jpg` }} />

                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Modal
                    visible={this.state.modalVisible}
                    backdropColor={'white'}
                    backdropOpacity={1}
                    animationIn={'slideInLeft'}
                    animationOut={'slideOutRight'}
                    stsyle={styles.modal}
                    onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
                    style={{
                      zIndex: 2, justifyContent: "center", alignItems: 'center',
                      backdropColor: "#000",
                    }}
                    presentationStyle='overFullScreen'
                  >
                    <View style={{ flex: 1, width: "100%", height: "100%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{ position: "absolute", top: 10, left: 10, zIndex: 2, }}>
                        <Icon name="md-close-circle-outline"
                          style={{ fontSize: 30, color: "#fff", }} />
                      </TouchableOpacity>
                      <ImageViewer imageUrls={this.state.images} />
                    </View>

                  </Modal>
                </View>
                : null}
              <View>

                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Reviews</Text>
                <ScrollView>
                  {item[2].map((reviews, index) => (
                    <View key={index} style={styles.reviewsItem}>
                      <View style={styles.reviewsItemHeader}>
                        {/* <Text>{reviews.reviews_rating}</Text> */}
                        <ImageBackground
                          source={{
                            uri: `http://firstbankmi.com/images/stars/star-bg.png`
                          }}
                          resizeMode="contain"
                          style={{ width: 86, height: 26, flex: 1 }}
                        >
                          {this.revievsStar(reviews.reviews_rating)}
                        </ImageBackground>
                        <Text selectable={true}>{reviews.date_}</Text>
                      </View>
                      <Text selectable={true}>{reviews.text}</Text>
                    </View>
                  ))}
                </ScrollView>
                {item[2] != false ? (
                  <Text onPress={() =>
                    this.props.navigation.navigate("Reviews", {
                      itemId: item.id,
                      title: `Reviews - ${item.name}`
                    })
                  } style={{ fontSize: 18, color: "#51ab6d", marginBottom: 10 }}>More reviews</Text>
                ) : null}
              </View>
              {item.phone ?
                <View>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 15
                  }}>Call to restoran</Text>
                  <Text style={{ color: "#51ab6d" }}
                    onPress={() => { Linking.openURL(`tel:${item.phone}`); }}
                  >{item.phone}</Text>
                </View>
                : null}
              {item.website ?
                <View style={{ paddingBottom: 15 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 15
                  }} >Web site</Text>
                  <Text selectable={true}
                    style={{ color: "#51ab6d" }}
                    onPress={() => { Linking.openURL(`${item.website.split('?')[0]}`); }}
                  >{item.website.split('?')[0]}</Text>
                </View>
                : null}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView >
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
  h1: {
    fontSize: 30,
    marginBottom: 15,
  },
  headerIco: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  listStyle: {
    flex: 1
  },
  img: {
    flex: 1,
    width: 300,
    height: 300
  },
  title: {
    color: "#51ab6d",
    fontSize: 20
  },
  blogWrap: {
    flex: 1,
    marginTop: 25,
    marginBottom: 25
  },
  ratingItem: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  sheduleItem: {
    flexDirection: "row",
    flex: 1,
    marginTop: 8,
    paddingTop: 8,
    fontSize: 16,
    borderColor: "#ddd"
  },

  sheduleItemText: {
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 16
  },
  btn: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#51ab6d"
  },
  reviewsItem: {
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: "#f8f9fa"
  },
  reviewsItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    margin: 0

  }
});
