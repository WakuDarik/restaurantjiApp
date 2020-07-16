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
const Entities = require('html-entities').XmlEntities;

import Icon from 'react-native-vector-icons/Ionicons';

export default class Categori extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            serverData: [],
            //Data Source for the FlatList
            fetching_from_server: false,
            shtat: [],
            query: "",
            latCity: 0,
            lngCity: 0,
            menuOpen: false,
            value: 0,
            //Loading state used while loading more data
        };
        this.offset = 0;
        this.arrayholder;
    }

    getCurrentLocation = () =>
        navigator.geolocation.getCurrentPosition(
            position => {
                const location = JSON.stringify(position.coords);
                return location;
            },
            error => {
                console.log(error);
            },
            {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 0,
                distanceFilter: 10
            }
        );
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam("title", "Serch"),
            headerLeft: (
                <TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={() => navigation.goBack(null)}>
                    <Icon
                        color='#fff'
                        backgroundColor="#fff"
                        name="md-arrow-round-back"
                        style={{ fontSize: 30, color: "#fff" }}
                    />
                </TouchableOpacity>
            ),
        };
    }



    async componentDidMount () {

        /*LOCATION : */
        const { navigation } = this.props;
        const id = navigation.getParam("categoriID", "1");

        //Grant the permission for Location

        //----LOCATION END----//
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                try {
                    const config = {
                        method: "POST",
                        body: JSON.stringify({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        })
                    };
                    const response = await fetch(
                        `http://firstbankmi.com/git/restApp/getBiz.php?q=getBizByCategori&offset=${id}`,
                        config
                    );
                    const responseJson = await response.json();
                    this.offset = this.offset + 10;

                    this.setState({
                        isLoading: false,
                        serverData: [...this.state.serverData, ...responseJson],
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    this.arrayholder = responseJson;
                } catch (error) {
                    console.error(error);
                }
            });
        }

        //setting the data in the shtat state
    }

    SortListFunc = () => {
        const newData = this.arrayholder.sort((a, b) => b.rating.localeCompare(a.rating))
        this.setState({ serverData: newData });
    };

    SortListFuncDist = () => {
        const newDataDis = this.arrayholder.sort((a, b) => a.distance.toString().localeCompare(b.distance))
        this.setState({ serverData: newDataDis });
    };

    renderHeader () {
        const { navigation } = this.props;
        const category = navigation.getParam("title", "Fast food");
        return (
            <View>
                <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "bold", marginTop: 15, marginBottom: 10, }}>Restaurants in category {category}</Text>
                {/* <View>
          <TextInput
            onChangeText={(value) => this.setState({ value })}
            value={this.state.value}
          />
          <Button
            title="Go"
            onPress={() =>
              this.props.navigation.navigate("test", {
                itemId: this.state.value,
              })
            }
          />
        </View> */}
                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, flexDirection: "row", justifyContent: "space-evenly" }} >
                    <TouchableOpacity
                        style={{ width: '45%', borderWidth: 1, borderColor: '#ccc', paddingTop: 5, paddingBottom: 5, backgroundColor: "#82ca97", }}
                        onPress={this.SortListFuncDist}
                    >
                        <Text style={{ textAlign: "center", color: "#fff", }}>Sort by disttance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: '45%', borderWidth: 1, borderColor: '#ccc', paddingTop: 5, paddingBottom: 5, backgroundColor: "#82ca97", }}
                        onPress={this.SortListFunc}
                    >
                        <Text style={{ textAlign: "center", color: "#fff", }}>Sort by rating</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    //Demo base API to get the data for the Autocomplete suggestion







    render () {
        const entities = new Entities();

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        return (

            <View
                style={{ flex: 1, }}
            >
                {/* <Text>{this.state.lng} - lat</Text> */}
                {this.state.serverData.length != 0 ?
                <FlatList
                    style={styles.listStyle}
                    data={this.state.serverData}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.blogWrap}
                            onPress={() =>
                                this.props.navigation.navigate("Profile", {
                                    itemId: item.business_id,
                                    title: item.bz_name
                                })
                            }>
                            {/* <Text style={styles.title}>{item.title}</Text> */}
                            <View style={styles.imgWrap}>
                                {item.photo_name ? (
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

                                >{entities.decode(item.bz_name)}</Text>
                                <Text>{item.phone}</Text>
                                <Text style={{ textAlign: "left" }}>{entities.decode(item.address)}</Text>
                                <Text style={{ textAlign: "left" }}>Rating - {item.rating}</Text>
                                <Text>distance - {item.distance} miles</Text>

                            </View>


                            {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 5, paddingLeft: 5, paddingRight: 5, }}>
                                <View style={{ flex: 1 / 2 }}>

                                </View>
                                <View style={{ flex: 1 / 2 }}>
                                </View>
                            </View> */}
                        </TouchableOpacity>
                    )}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    keyExtractor={item => String(item.business_id)}
                />
                : <View>
                <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "bold", marginTop: 15, marginBottom: 10, }}>No results found</Text>
            </View>}
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
