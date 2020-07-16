import React from "react";
import {
  View,
  Text,
  ModalFooter,
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

import HTML from "react-native-render-html";


export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, serverData: [], modalVisible: false, images: [] };
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
    try {
      const response = await fetch(
        `http://firstbankmi.com/git/restApp/getBiz.php?q=getBizSolo&id=7993`
      );
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        serverData: [...this.state.serverData, ...responseJson]
      });
      console.log(JSON.stringify(responseJson));
    } catch (error) {
      console.error(error);
    }
    this.state.serverData.map((item, index) => (
      item[4].map((img, index) => (
        // this.setState(  
        //   this.state.images.push({url: `https://1179658579.rsc.cdn77.org/${img.abbreviation}/${img.city_name}/${img.business_id}/original/${img.photo_name}.jpg`})
        //   )
        this.setState(state => ({
          images: state.images.concat({
            url: `https://1179658579.rsc.cdn77.org/${img.abbreviation}/${img.city_name}/${img.business_id}/original/${img.photo_name}.jpg`
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

  sheduleRender = (open, close) => {
    if (open === "Closed") {
      return <Text style={styles.sheduleItemText} selectable={true}>Colosed</Text>;
    } else if (open === "Open 24") {
      return <Text style={styles.sheduleItemText} selectable={true}>Open 24</Text>;
    } else {
      return (
        <>
          <Text style={{ fontSize: 20 }} selectable={true}>{open}</Text>
          <Text style={styles.sheduleItemText} selectable={true}>-</Text>
          <Text style={{ fontSize: 20 }} selectable={true}>{close}</Text>
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

    // let images = []

    // console.log (images)
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
      <View
        style={{ flex: 1, paddingTop: 20, paddingLeft: 5, paddingRight: 5 }}
      >
        <ScrollView>
          {this.state.serverData.map((item, index) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.h1} selectable={true}>{entities.decode(item.name)}</Text>
              {/* <Text style={{ fontSize: 18, color: "#51ab6d", marginBottom: 10 }} selectable={true}
                onPress={() => { Linking.openURL(`https://www.google.com/maps/place/${item.address}`); }}
              >{entities.decode(item.address)}</Text> */}
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
                    onPress={() => { Linking.openURL(`https://www.google.com/maps/place/${item.address}`); }}
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
                    onPress={() => Linking.openURL(item.website)}
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


              {/* <Text style={{ fontSize: 18, marginBottom: 10, color: "#51ab6d" }} onPress={() => { Linking.openURL(`tel:${item.phone}`); }} selectable={true}>
                {item.phone}
              </Text> */}
              {/* <Text style={{ fontSize: 18,  }}>
                latitude: {item.latitude}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                longitude: {item.longitude}
              </Text> */}
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

              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Tips</Text>
                {item[3].map((item, index) => (
                  <View key={index}>
                    <Text >
                      {entities.decode(item)}
                    </Text>
                  </View>
                ))}
              </View>

              {item[0].map((days, index) => (
                <View key={index} style={styles.sheduleItem}>
                  <Text style={{ marginRight: 40, flex: 1, fontSize: 20 }}>
                    {daysWeek[days.day]}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 2,
                      justifyContent: "space-around"
                    }}
                  >
                    {this.sheduleRender(days.open, days.close)}
                  </View>
                </View>
              ))}
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 15 }}>Photos</Text>
                <ScrollView
                  horizontal>
                  {item[4].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.setModalVisible(true);
                      }}>

                      <Image style={{ width: 200, height: 200 }}
                        source={{ uri: `https://1179658579.rsc.cdn77.org/${item.abbreviation}/${item.city_name}/${item.business_id}/original/${item.photo_name}.jpg` }} />

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
                  style={{ position: "relative", zIndex: 2 }}
                  presentationStyle="overFullScreen"
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
              <View>
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
                      <Text selectable={true}>{entities.decode(reviews.text)}</Text>
                    </View>
                  ))}
                </ScrollView>
                {item[2] != false ? (
                  <Text onPress={() =>
                    this.props.navigation.navigate("Reviews", {
                      itemId: item.id,
                      title: `Reviews - ${entities.decode(item.name)}`
                    })
                  } style={{ fontSize: 18, color: "#51ab6d", marginBottom: 10 }}>More reviews</Text>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
      </View >
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
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },

  sheduleItemText: {
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 20
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
