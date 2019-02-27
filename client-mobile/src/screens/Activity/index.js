import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
  TouchableOpacity,
  SegmentedControlIOS,
  ScrollView,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { listTransactionByRequesterId } from "../../redux/actions/transaction";

import { isSignedIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import EquipmentItem from "./components/EquipmentItem";
import StepProgress from "./components/StepProgress";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import Ionicons from "@expo/vector-icons/Ionicons";

const STEP_PROGRESS_OPTIONS = [
  {
    id: 1,
    name: "Pending",
    value: "PENDING"
  },
  {
    id: 2,
    name: "Accepted",
    value: "ACCEPTED"
  },
  {
    id: 3,
    name: "Processing",
    value: "PROCESSING"
  },
  {
    id: 4,
    name: "Returning",
    value: "RETURNING"
  }
];

@connect(
  state => {
    return {
      auth: state.auth.userIsLoggin,
      loading: state.transaction.loading,
      listTransaction: state.transaction.listRequesterTransaction
    };
  },
  dispatch => ({
    fetchRequesterTransaction: id => {
      dispatch(listTransactionByRequesterId(id));
    }
  })
)
class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      selectedIndex: 0
    };
  }

  componentDidMount() {
    this.props.fetchRequesterTransaction(12);
  }

  _handleFilterStatusResult = status => {
    const { listTransaction } = this.props;
    const result = listTransaction.data.filter(item => item.status === status);
    return result;
  };

  renderContent = ({ listTransaction }) => {
    const { selectedIndex } = this.state;
    if (listTransaction.length > 0) {
      switch (selectedIndex) {
        case 0:
          return this._renderFlatList("PENDING");
        case 1:
          return this._renderFlatList("ACCEPTED");
      }
    } else {
      return (
        <View style={styles.actionWrapper}>
          <Text style={styles.text}>No data</Text>
        </View>
      );
    }
  };

  //Render flat list base on status
  _renderFlatList = status =>
    this._handleFilterStatusResult(status).length > 0 ? (
      <FlatList
        style={{ flex: 1, paddingHorizontal: 15 }}
        data={this._handleFilterStatusResult(status)}
        renderItem={({ item }) => this._renderItem(status, { item })}
        keyExtractor={(item, index) => index.toString()}
      />
    ) : (
      <View style={styles.actionWrapper}>
        <Text style={styles.text}>No data</Text>
      </View>
    );

  //Render row item
  _renderItem = (status, { item }) => (
    <View style={styles.pendingRowItem}>
      <EquipmentItem
        onPress={() =>
          this.props.navigation.navigate("Detail", { id: item.id })
        }
        key={`eq_${item.id}`}
        id={item.id}
        name={item.equipment.name}
        imageURL={
          "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
        }
        status={item.status}
        contractor={item.equipment.contractor.name}
        phone={item.equipment.contractor.phoneNumber}
        beginDate={item.beginDate}
        endDate={item.endDate}
      />
      {status !== "ACCEPTED" ? (
        <StepProgress options={STEP_PROGRESS_OPTIONS} status={item.status} />
      ) : null}
    </View>
  );

  render() {
    const { checkedSignIn, signedIn } = this.state;
    const { navigation, auth, listTransaction, loading } = this.props;

    if (auth) {
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "always", top: "always" }}
        >
          <Header
            renderRightButton={() => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
              >
                <Ionicons name="ios-notifications-outline" size={24} />
              </TouchableOpacity>
            )}
          >
            <SegmentedControlIOS
              style={{ width: 300 }}
              values={["Pending", "Hired"]}
              selectedIndex={this.state.selectedIndex}
              onChange={event => {
                this.setState({
                  selectedIndex: event.nativeEvent.selectedSegmentIndex
                });
              }}
              tintColor={colors.primaryColor}
            />
          </Header>
          {!loading ? this.renderContent(listTransaction) : <Loading />}
        </SafeAreaView>
      );
    } else {
      return <RequireLogin navigation={navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pendingRowItem: {
    borderRadius: 15,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 15,
    marginTop: 5
  },
  actionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "35%",
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3",
    padding: 30
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default Activity;
