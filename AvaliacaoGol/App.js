//This is an example code to get Geolocation//  
import React from 'react';
//import react in our code. 
import { View, Text, StyleSheet, Image, PermissionsAndroid, Platform } from 'react-native';
//import all the components we are going to use.

import MapView, { Marker } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';


export default class App extends React.Component {
  state = {
    currentLongitude: 'unknown',//Initial Longitude
    currentLatitude: 'unknown',//Initial Latitude
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
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        that.setState({ currentLongitude: currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        that.setState({ currentLatitude: currentLatitude });
        //Setting state Latitude to re re-render the Longitude Text
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
      console.log(position);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      that.setState({ currentLongitude: currentLongitude });
      //Setting state Longitude to re re-render the Longitude Text
      that.setState({ currentLatitude: currentLatitude });
      //Setting state Latitude to re re-render the Longitude Text
    });
  }
  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
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


      return (
        <View style={styles.container}>
          <MapView
            showsUserLocation={true}
            style={styles.map}
            initialRegion={myLocation}
          >
            <Marker coordinate={myLocation} />
          </MapView>
        </View>
      )
    }
    else {
      return (<Text>No location found!</Text>)
    }
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    height: 500,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});