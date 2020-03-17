import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Text, TouchableOpacity, Platform, Image, Switch } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }
    state = {
        title: "",
        currentPlaceWeather: 0,
        currentLongitude: 'unknown',
        currentLatitude: 'unknown',
        locationInfo: {
            loading: true,
            dataSource: []
        },
        locationWeather: {
            loading: true,
            dataSource: []
        },
        isCelsius: true
    }
    componentDidMount = () => {
        var that = this;
        //Checking for the permission just after component loaded
        if (Platform.OS === 'ios') {
            this.callLocation(that);
        } else {
            async function requestLocationPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        'title': 'Location Access Required',
                        'message': 'This App needs to Access your location'
                    }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        that.callLocation(that);
                    } else {
                        alert("Permission Denied");
                    }
                } catch (err) {
                    alert("err", err);
                    console.warn(err)
                }
            }
            requestLocationPermission();
        }
    }
    callLocation(that) {
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);
                that.setState({ currentLongitude: currentLongitude });
                that.setState({ currentLatitude: currentLatitude });
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            that.setState({ currentLongitude: currentLongitude });
            that.setState({ currentLatitude: currentLatitude });
        });
    }
    componentWillUnmount = () => {
        Geolocation.clearWatch(this.watchID);
    }

    formatTemperature = (temperature) => {
        let result = temperature;
        if (!this.state.isCelsius)
            result = (temperature * 1.8) + 32;
        return result;
    }

    _handleToggleSitch = (value) => {
        this.setState(state =>
            ({
                isCelsius: !state.isCelsius
            }));
        return () => mounted = false;
    };

    FlatListItemSeparator = () => {
        return (
            <View style={{
                height: .5,
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
            />
        );
    }

    renderItem = (data) =>
        <TouchableOpacity style={styles.list}>
            <Text style={styles.lightText}>{data.item.applicable_date}</Text>
            <Text style={styles.lightText}>{this.formatTemperature(data.item.min_temp).toFixed(0)}º</Text>
            <Text style={styles.lightText}>{this.formatTemperature(data.item.max_temp).toFixed(0)}º</Text>
            <Image
                style={styles.lightImage}
                source={{ uri: 'https://www.metaweather.com/static/img/weather/png/64/' + data.item.weather_state_abbr + '.png' }}
            />
        </TouchableOpacity>

    getWeatherByLocation(woeid) {
        fetch("https://www.metaweather.com/api/location/" + woeid)
            .then(response => response.json())
            .then((responseJson) => {
                this.setState({
                    locationWeather: {
                        loading: false,
                        dataSource: responseJson.consolidated_weather
                    }
                });
                this.setState({
                    title: responseJson.title,
                    currentPlaceWeather: responseJson.consolidated_weather[0].the_temp
                });
            })
            .catch(error => console.log(error))
    }

    render() {

        try {
            latitude = parseFloat(this.state.currentLatitude);
            longitude = parseFloat(this.state.currentLongitude);

        }
        catch (e) {
        }
        if (this.state && !isNaN(latitude) && !isNaN(longitude)) {

            const myLocation = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }

            fetch("https://www.metaweather.com/api/location/search/?lattlong=" + myLocation.latitude + "," + myLocation.longitude)
                .then(response => response.json())
                .then((responseJson) => {
                    this.getWeatherByLocation(responseJson[0].woeid.toString());
                })
                .catch(error => console.log(error))

            return (
                [
                    <View key="headerView" style={styles.headerView}>
                        <Text style={styles.textHeader}>{this.state.title} {this.formatTemperature(this.state.currentPlaceWeather).toFixed()}º</Text>
                    </View>,
                    <View key='mapView' style={styles.containerMap}>
                        <MapView
                            showsUserLocation={true}
                            style={styles.map}
                            initialRegion={myLocation}
                        >
                            <Marker coordinate={myLocation} />
                        </MapView>
                    </View>,
                    <View key='weatherListView' style={styles.containerWheaterList}>
                        <FlatList
                            data={this.state.locationWeather.dataSource}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem(item)}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>,
                    <View key='bottomView' style={styles.containerBottom}>
                        <Text style={{ flex: 1, fontSize: 23, width: 200, alignSelf: 'baseline' }}>{this.state.isCelsius ? 'Celsius' : 'Fahrenheit'}</Text>
                        <Switch
                            onValueChange={this._handleToggleSitch}
                            value={this.state.isCelsius}
                            style={{ flex: 1 }}
                        />
                    </View>
                ])
        }
        else {
            return (<Text>No location found!</Text>)
        }
    }
}

const styles = StyleSheet.create({
    containerHeader: {
        position: "relative",
        left: 0,
        right: 0,
        bottom: 0,
        height: 0,
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textHeader: {
        fontSize: 30,
        marginTop: 40,
        marginBottom: 20,
        justifyContent: 'center',
        textAlignVertical: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    containerMap: {
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    containerWheaterList: {
        position: "relative",
        top: 10,
        left: 10,
        right: 0,
        bottom: 0,
        height: 150,
    },
    containerBottom: {
        position: "relative",
        top: 15,
        left: 10,
        right: 0,
        bottom: 0,
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: "row"
    },

    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    list: {
        backgroundColor: "#fff",
        width: "90%",
        flexDirection: "row"
    },

    lightText: {
        flex: 1,
        justifyContent: "flex-start"
    },
    lightImage: {
        height: 25,
        width: 25
    }
});