import React, { Component } from "react";
import { View } from "react-native"
import { Icon } from "react-native-elements"
import { createStackNavigator } from "@react-navigation/stack"
import Home from "./Home"
import Orders from "./Orders";
import {THEME} from "./theme"
const Stack = createStackNavigator();

function HomeNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{
                header: () => { return <View></View> }
            }}
            />
            <Stack.Screen name="Orders" component={Orders} options={{
                title: "Demandes", headerStyle: {
                    backgroundColor: THEME.backgroundColor1,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            
        </Stack.Navigator>
    )
}



export default class Main extends Component {


    constructor(props) {
        super(props)

    }

    render() {
        return (
                <View style={{ flex: 1 }}>
                    <HomeNavigator/>
                </View>
        )
    }
}