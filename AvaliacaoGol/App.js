import React from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, Platform, Switch } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';


export default class App extends React.Component {

constructor(props) {
super(props);
}
state = {
currentLongitude: 'unknown',
currentLatitude: 'unknown',
locationWeather: {
loading: true,
dataSource: []
},
isCelsius: false
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

_handleToggleSitch = (value) => {
this.setState(state =>
({
isCelsius: !state.isCelsius
}));
return () => mounted = false;
};

render() {

try {
latitude = parseFloat(this.state.currentLatitude);
longitude = parseFloat(this.state.currentLongitude);

}
catch (e) {
}
if (this.state && !isNaN(latitude) && !isNaN(longitude)) {


/* Geocoder.init("AIzaSyCfInu_VPoTcILlS6Y06O5rx82E5_EYC0s")
Geocoder.from(latitude,longitude).then(json=> {
var location = json.results[0].geomery.location;
console.log(location);
});*/

const myLocation = {
latitude: latitude,
longitude: longitude,
latitudeDelta: 0.0922,
longitudeDelta: 0.0421,
}


return (
[
<View key='mapView' style={styles.containerMap}>
<MapView
showsUserLocation={true}
style={styles.map}
initialRegion={myLocation}
>
<Marker coordinate={myLocation} />
</MapView>
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
containerMap: {
position: "relative",
top: 100,
left: 0,
right: 0,
bottom: 0,
height: 400,
justifyContent: 'flex-end',
alignItems: 'center',
},
containerBottom: {
position: "relative",
top: 120,
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
});