import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../config'

export default class CustomSideBarMenu extends Component{

  constructor(){
    super()
    this.state={
      image:'#',
      userid:firebase.auth().currentUser.email,
      name:'',
      docid:''
    }
  }

  selctpicture = async() => {
    const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect:[4,3],
      quality:1
    })
    if(! cancelled){
      this.uplaodimage(uri,this.state.userid)
    }
  }

  uplaodimage = async(uri,imagename) => {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase.storage().ref().child("user_profiles/" + imagename)
    return ref.put(blob).then((response)=>{
      this.fetchimage(imagename)
    })
  }

  fetchimage = async(imagename) => {
    var storageref = firebase.storage().ref().child("user_profiles/" + imagename)
    storageref.getDownloadURL().then((url)=>{
      this.setState({
        image:url
      })
      .catch((error)=>{
        this.setState({
          image:'#'
        })
      })
    })
  }

  getuserprofile = () => {
    db.collection('users').where('email_id','==',this.state.userid).onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          name:doc.data().first_name + "  " + doc.data().last_name,
          docid:doc.id,
          image:doc.data().image
        })
      })
    })
  }

  componentDidMount(){
    this.fetchimage(this.state.userid)
    this.getuserprofile()
  }

  render(){
    return(
      <View style={{flex:1}}>
        <Avatar rounded source={{uri:this.state.image}} size = "medium" onPress={()=>{
          this.selctpicture()
        }} containerStyle={styles.imagecontainer} showEditButton />
        <Text style={styles.text}> {this.state.name} </Text>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
