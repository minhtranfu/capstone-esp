import React, { Component } from "react";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import {
  supplierPlaceBid,
  supplierEditBid
} from "../../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import Header from "../../../components/Header";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

@connect(
  state => ({}),
  dispatch => ({
    fetchPlaceBid: bid => {
      dispatch(supplierPlaceBid(bid));
    },
    fetchEditBid: (bidId, bid) => {
      dispatch(supplierEditBid(bidId, bid));
    }
  })
)
class PlaceBid extends Component {
  static propTypes = {
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      price: props.price ? props.price : 0,
      description: props.description ? props.description : ""
    };
  }

  _handlePlaceBid = () => {
    const { price, description } = this.state;
    const { postId } = this.props;
    const bid = {
      price: parseInt(price),
      description,
      debrisPost: {
        id: postId
      }
    };
    this.props.fetchPlaceBid(bid);
    this.props.setModalVisible(false);
  };

  _handleEditBid = () => {
    const { price, description } = this.state;
    const { postId, bidId } = this.props;
    const bid = {
      price: parseInt(price),
      description,
      debrisPost: {
        id: postId
      }
    };
    this.props.fetchEditBid(bidId, bid);
    this.props.setModalVisible(false);
  };

  render() {
    const { visible, onPress, isEdited, title, setModalVisible } = this.props;
    const { price, description } = this.state;
    return (
      <Modal animationType={"slide"} visible={visible}>
        <SafeAreaView
          forceInset={{ bottom: "always", top: "always" }}
          style={styles.container}
        >
          <Header
            renderLeftButton={() => (
              <TouchableOpacity
                onPress={() => this.props.setModalVisible(false)}
              >
                <Feather name={"x"} size={26} />
              </TouchableOpacity>
            )}
          />
          <ScrollView>
            <Text>Place a bid on</Text>
            <Text>{title}</Text>
            <Text>Paid to you</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.inputWrapper}
                onChangeText={value => this.setState({ price: value })}
                value={price.toString()}
                keyboardType={"numeric"}
              />
              <Text> VND </Text>
            </View>
            <Text>Describe your bid</Text>
            <TextInput
              style={styles.wrapper}
              onChangeText={value => this.setState({ description: value })}
              value={description}
            />
            {isEdited ? (
              <TouchableOpacity onPress={() => this._handleEditBid()}>
                <Text>Edit bid</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this._handlePlaceBid()}>
                <Text>Place bid</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputWrapper: {
    paddingLeft: 10,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    width: 200,
    height: 30
  },
  wrapper: {
    paddingLeft: 10,
    height: 200,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400"
  }
});

export default PlaceBid;
