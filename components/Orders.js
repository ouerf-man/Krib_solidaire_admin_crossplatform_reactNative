import React, { Component } from 'react'
import { View, Text, Modal, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Linking } from "react-native"
import { Button, colors } from "react-native-elements"
import { db } from "./firebase/init"
import { THEME } from "./theme"
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            keysOfService: [],
            keys: [],
            errorMessage: 'لا يوجد طلب',
            id: [],
            modalVisible: false,
            orderInModal: {},
            userInModal: '',
            orderIdInModal: "",
        };
    }

    componentDidMount() {
        this.readData();
    }

    // Handle the delete of 1 element

    

    async handleDelete(uid, key) {
        let userRef = db.ref(`${uid}/services/${key}`);
        alert(userRef)
        try {
            await userRef.remove()
        } catch (e) {
            alert('error occured')
        }
    }

    handleMap() {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${this.state.orderInModal.lag},${this.state.orderInModal.lng}`;

        const url = Platform.select({
            ios: `${scheme}@${latLng}`,
            android: `${scheme}${latLng}`
        });
        Linking.openURL(url);
    }

    async readData() {


        // Create a reference
        const ref = db.ref();

        // Fetch the data snapshot
        try {
            // i'm trying to put the data in array that contains arrays of data, each user with his own array
            // the problem is val[key].service is not an object :( 
            // problem line 70 -> line 67 doesn't return an object
            await ref.once("value", (snapshot) => {
                const val = snapshot.val()
                if (val) {
                    this.setState({ id: Object.keys(val) })
                    let arrayOfService = Object.values(val)
                    for (let i = 0; i < arrayOfService.length; i++) {
                        this.setState((prevState) => prevState.keysOfService.push(Object.keys(arrayOfService[i].services)))
                        this.setState((prevState) => prevState.orders.push(Object.values(arrayOfService[i].services)))
                    }
                    this.setState({ errorMessage: "" })
                }
            });



        } catch (e) {
            this.setState({ errorMessage: 'problème de connexion...' })
            return;
        }


    }



    render() {

        const RenderUserOrders = (props) => {
            return (
                <View>
                    {
                        props.element.map((item, orderId) => {
                            return (
                                <TouchableOpacity
                                    key={orderId}
                                    onPress={() => { this.setState({ modalVisible: true, orderInModal: item, userInModal: props.userInModal, orderIdInModal: props.keys[orderId] }) }}
                                >
                                    <View style={
                                        styles.orders
                                    }>
                                        <View>
                                            <Text
                                                style={styles.date}
                                            >
                                                {item.dateDemande}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.order}>
                                                {item.user}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            <ScrollView>
                {
                    this.state.orders.map((element, instanceId) => {
                    
                        return <RenderUserOrders key={instanceId} element={element} keys={this.state.keysOfService[instanceId]} userInModal={this.state.id[instanceId]} indexKey={instanceId} />

                    })
                    
                }
                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalText}>
                                <Text style={styles.label}>
                                    date Demande :
                                </Text>
                                <Text style={styles.item}>
                                    {this.state.orderInModal.dateDemande}
                                </Text>
                            </View>
                            <View style={styles.modalText}>
                                <Text style={styles.label}>
                                    Nom :
                                </Text>
                                <Text style={styles.item}>
                                    {this.state.orderInModal.user}
                                </Text>
                            </View>
                            <View style={styles.modalText}>
                                <Text style={styles.label}>
                                    adresse :
                                </Text>
                                <Text style={styles.item}>
                                    {this.state.orderInModal.adresse}
                                </Text>
                            </View><View style={styles.modalText}>
                                <Text style={styles.label}>
                                    numéro tel :
                                </Text>
                                <Text style={styles.item}>
                                    {this.state.orderInModal.tel}
                                </Text>
                            </View>
                            <View style={styles.modalText}>
                                <Text style={styles.label}>
                                    les services :
                                </Text>
                                <Text style={styles.item}>
                                    {this.state.orderInModal.service}
                                </Text>
                            </View>
                            <View style={styles.buttons}>
                                {
                                    this.state.orderInModal.etat!== 1  ? <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#4BB543" }}
                                        onPress={() => {
                                            db.ref(`${this.state.userInModal}/services/${this.state.orderIdInModal}/etat/`).set(1);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Confimer</Text>
                                    </TouchableHighlight> :
                                        <TouchableHighlight
                                            style={{ ...styles.openButton, backgroundColor: "#00ccff" }}
                                            onPress={() => {
                                                db.ref(`${this.state.userInModal}/services/${this.state.orderIdInModal}/etat`).set(2)
                                                this.handleDelete(this.state.userInModal,this.state.orderIdInModal)
                                            }}
                                        >
                                            <Text style={styles.textStyle}>Demande delivré</Text>
                                        </TouchableHighlight>
                                }
                                <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#F32013" }}
                                    onPress={
                                        () => {
                                            this.handleDelete(this.state.userInModal, this.state.orderIdInModal)
                                        }
                                    }
                                >
                                    <Text style={styles.textStyle}>Annuler</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#00ccff", width: 60 }}
                                    onPress={
                                        () => {
                                            this.handleMap()
                                        }
                                    }
                                >
                                    <Text style={styles.textStyle}>Map</Text>
                                </TouchableHighlight>
                            </View>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: THEME.backgroundColor1 }}
                                onPress={() => {
                                    this.setState({ modalVisible: false })
                                }}
                            >
                                <Text style={styles.textStyle}>
                                    fermer
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
    orders: {
        borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
        width: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25
    },
    date: {
        fontSize: 8,
        marginRight: 5
    },
    order: {
        fontSize: 15
    },
    delete: {
        backgroundColor: 'red',
        width: 70,
        height: 30
    },
    error: {
        width: width * .6,
        marginTop: 55,
        backgroundColor: 'red'
    },
    user: {
        marginBottom: 30,
        backgroundColor: '#dcdcdc'
    },







    centeredView: {
        flex: 1,
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: THEME.backgroundColor1,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 35,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        color: "#777b7e",
        marginBottom: 10
    },
    item: {
        textAlign: "center",
        fontSize: 18
    },
    buttons: {
        flexDirection: "row",
        justifyContent: 'space-around',
        marginBottom: 30
    }
})

export default Orders;

