import React, { useEffect } from "react"
import { View, ImageBackground, Text, StyleSheet, Dimensions } from "react-native"
import { Button } from "react-native-elements"
import {THEME} from "./theme"

const Home = ({navigation}) => {
    
    return (
        <ImageBackground
            source={require('./images/bg.jpg')}
            style={style.backgroundImage}
        >
            <Text style={style.text}>
                Admin
            </Text>
            <Button
                title="liste des demandes"
                buttonStyle={style.button2}
                titleStyle={style.textButton2}
                onPress={()=>{navigation.navigate('Orders')}}
            />
        </ImageBackground>
    )
}

export default Home;
const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: 1,

    },
    button2: {
        backgroundColor: THEME.backgroundColor2,
        width: width * 0.75,
        marginTop: 25,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FEFEFE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton2:{
        fontSize:24,
        color:THEME.Color1,
        fontWeight:"bold"
    },
    text:{
        fontSize:28,
        textAlign: "center",
        color: THEME.Color2
    }
})