import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

import Icon from 'react-native-vector-icons/Ionicons';


export default class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, serverData: [], modalVisible: false, id: 0,
      inputs: {
        name: {
          value: ""
        },
        email: {
          value: ""
        },
        message: {
          value: ""
        },
      }
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  // submit = () => {
  //   let send = new Array();
  //   this.state.inputs.name.value ? send[0] = 0 : alert('Enter your name'), send[0] = 1;
  //   this.state.inputs.email.value ? send[1] = 0 : alert('Enter your contact'), send[1] = 1;
  //   this.state.inputs.message.value ? send[2] = 0 : alert('Enter your message'), send[2] = 1;

  //   if (send.find( (1) )) {
  //     alert('Ok')
  //   } else {
  //     alert('Все ок');
  //   }
  // }


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  _closeModal () {
    this.setState({ modalVisible: false });
    this.props.navigation.setParams({ shouldEnableGestures: true });
  }

  setid (id) {
    this.setState({ id: id });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam(`title`, "Reviws"),
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
    const id = navigation.getParam("itemId", "1");
    try {
      const response = await fetch(
        `http://firstbankmi.com/git/restApp/getBiz.php?q=getBizRev&id=${id}`
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
  }


  revievsStar = rating => {
    rating = (rating / 5) * 100;
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

  onInputChange ({ id, value, cb = () => { } }) {
    const { inputs } = this.state;
    this.setState(
      {
        inputs: {
          ...inputs,
          [id]: {
            value: value
          }
        }
      },
      cb
    );
  }

  render () {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View
        style={{ flex: 1, paddingTop: 20, paddingLeft: 5, paddingRight: 5 }}
      >
        <FlatList
          data={this.state.serverData}
          renderItem={({ item }) => (
            <View style={styles.reviewsItem}>
              <View style={styles.reviewsItemHeader}>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(true);
                    this.setid(item.id)
                  }}> */}
                  <ImageBackground
                    source={{
                      uri: `http://firstbankmi.com/images/stars/star-bg.png`
                    }}
                    resizeMode="contain"
                    style={{ width: 86, height: 26, flex: 1 }}
                  >
                    {this.revievsStar(item.reviews_rating)}
                  </ImageBackground>
                  <Text selectable={true}>{item.date_}</Text>
                {/* </TouchableOpacity> */}
              </View>
              <Text selectable={true}>{entities.decode(item.text)}</Text>
            </View>
          )}
          keyExtractor={item => String(item.id)}
        />
        {/* <Modal
          visible={this.state.modalVisible}
          backdropColor={'black'}
          transparent={true}
          stsyle={styles.modal}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
          style={{
            zIndex: 2,
            backdropColor: "#000",
            alignItems: 'center',
            justifyContent: 'center'
          }}
          presentationStyle='overFullScreen'
        >
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: '80%',
              height: 400,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#ccc',
              borderWidth: 2,
              borderRadius: 10,
            }}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                style={{ position: "absolute", top: 10, left: 10, zIndex: 2, }}>
                <Icon name="md-close-circle-outline"
                  style={{ fontSize: 30, color: "#ccc", }} />
              </TouchableOpacity>
              <View>
                <Text style={{ fontSize: 30, color: '#000', }}>Report form</Text>
                <View>
                  <Text>Your name</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder='John Week'
                    onChangeText={value => {
                      this.onInputChange({ id: "name", value });
                    }}
                  />
                </View>
                <View>
                  <Text>Contact</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder='asd@gmail.com , telegram @user etc.'
                    onChangeText={value => {
                      this.onInputChange({ id: "email", value });
                    }}
                  />
                </View>
                <View>
                  <Text>Meassage</Text>
                  <TextInput
                    placeholder='Message'
                    editable
                    multiline
                    numberOfLines={6}
                    style={[styles.formInput, styles.textarea]}
                    onChangeText={value => {
                      this.onInputChange({ id: "message", value });
                    }}
                  />
                </View>

              </View>

              <TouchableOpacity style={{
                backgroundColor: "green",
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 10
              }}>
                <Text style={{ fontSize: 20, color: '#fff' }} onPress={this.submit}>submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>*/}
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
  split: {
    flexDirection: "row"
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  formInput: {
    color: '#000',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    maxWidth: 300,
    marginBottom: 10
  },
  textarea: {
    height: 150,
    overflow: 'scroll'
  },
  h1: {
    fontSize: 40,
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
  }
});
