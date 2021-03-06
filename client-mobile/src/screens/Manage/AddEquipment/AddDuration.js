import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";

import Calendar from "../../../components/Calendar";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import InputField from "../../../components/InputField";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class AddDuration extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeRanges: [{}],
      index: 0,
      calendarVisible: false,
      calendarIndex: 0,
      fromDate: "",
      toDate: "",
      endDateRange: "",
      dailyPrice: 0,
      suggestPrice: 0,
      loading: false
    };
  }

  componentDidMount() {
    this._handleLoadSuggestPrice();
  }

  _handleLoadSuggestPrice = async () => {
    const { data } = this.props.navigation.state.params;
    const type = {
      equipmentType: data.equipmentType,
      additionalSpecsValues: data.additionalSpecsValues
    };
    this.setState({ loading: true });
    const res = await axios.post("equipments/suggestedPrice", type);
    if (res) {
      this.setState({
        suggestPrice: res.data.suggestedPrice,
        loading: false
      });
    } else {
      this.setState({ loading: false });
    }
  };

  _handleAddMore = () => {
    const { beginDate, endDate, index } = this.state;
    // Add new empty data range
    const newRow = {
      beginDate: "",
      endDate: ""
    };

    this.setState({
      timeRanges: [...this.state.timeRanges, newRow]
    });
  };

  _handleRemove = rowIndex => {
    this.setState({
      timeRanges: this.state.timeRanges.filter(
        (item, index) => index !== rowIndex
      )
    });
  };

  //Confirm date select. If toDate = null, set toDate = fromDate add more 3 months
  _onSelectDate = (id, fromDate, toDate, modalVisible) => {
    const { timeRanges } = this.state;
    if (!timeRanges) {
      timeRanges = [];
    }
    let newToDate = toDate ? toDate : this._handleAddMoreMonth(fromDate, 3);
    timeRanges[id] = {
      beginDate: fromDate,
      endDate: newToDate
    };
    this.setState({
      timeRanges,
      calendarVisible: false
    });
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  //Open calendar
  _setCalendarVisible = (visible, index) => {
    const { timeRanges, endDateRange } = this.state;
    if (
      index > 0 &&
      !timeRanges[index - 1].endDate &&
      !timeRanges[index - 1].beginDate
    ) {
      this._showAlert("Please select your before time range!!!");
    } else {
      this.setState({
        calendarVisible: visible,
        calendarIndex: index
      });
    }
  };

  _renderCalendar = (id, beginDate, endDate) => {
    const { timeRanges } = this.state;
    console.log("asd", this._formatDate(beginDate));
    return (
      <Calendar
        visible={this.state.calendarVisible}
        onLeftButtonPress={() => this._setCalendarVisible(false)}
        onSelectDate={(fromDate, endDate, visible) =>
          this._onSelectDate(id, fromDate, endDate, visible)
        }
        minDate={
          id > 0
            ? this._handleAddMoreDay(timeRanges[id - 1].endDate, 2)
            : this._formatDate(beginDate)
        }
        maxDate={
          id > 0
            ? this._handleAddMoreMonth(timeRanges[id - 1].endDate, 3)
            : this._formatDate(endDate)
        }
      />
    );
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let newMonth = month < 10 ? "0" + month : month;
    let day = newDate.getDate();
    let newDay = day < 10 ? "0" + day : day;
    return year + "-" + newMonth + "-" + newDay;
  };

  _handleAddMoreDay = (date, day) => {
    let today = new Date(date);
    let result = today.setDate(today.getDate() + day);
    return this._formatDate(result);
  };

  _handleAddMoreMonth = (date, month) => {
    let today = new Date(date);
    let result = today.setMonth(today.getMonth() + month);
    return this._formatDate(result);
  };

  _renderDateRange = (item, index) => {
    const { timeRanges } = this.state;
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => this._setCalendarVisible(true, index)}
          style={{
            padding: 15,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 10,
            borderColor: colors.secondaryColor,
            marginBottom: 15
          }}
        >
          <Text style={styles.text}>Select your date range</Text>
        </TouchableOpacity>
        <View style={styles.timeRangeWrapper}>
          <View style={{ flexDirection: "column", paddingLeft: 10 }}>
            <Text style={styles.text}>Begin date</Text>
            <Text
              style={{
                fontSize: fontSize.secondaryText + 1,
                lineHeight: fontSize.secondaryText + 1
              }}
            >
              {timeRanges[index].beginDate
                ? moment(timeRanges[index].beginDate).format("DD-MM-YYYY")
                : "Begin Date"}
            </Text>
          </View>
          <View style={{ flexDirection: "column", paddingLeft: 10 }}>
            <Text style={styles.text}>End date</Text>
            <Text
              style={{
                paddingRight: 10,
                fontSize: fontSize.secondaryText + 1,
                lineHeight: fontSize.secondaryText + 1
              }}
            >
              {timeRanges[index].endDate
                ? moment(timeRanges[index].endDate).format("DD-MM-YYYY")
                : "End Date"}
            </Text>
          </View>
        </View>
        {index > 0 ? (
          <TouchableOpacity
            onPress={() => this._handleRemove(index)}
            style={{ alignItems: "flex-end" }}
          >
            <Text style={styles.textRemove}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  _validateEnableButton = () => {
    const { timeRanges } = this.state;

    if (
      (timeRanges[0].beginDate && timeRanges[0].endDate) ||
      timeRanges.length > 1
    ) {
      return true;
    }
    return false;
  };

  _renderBottomButton = (data, timeRanges) => (
    <TouchableOpacity
      style={[
        styles.buttonWrapper,
        this._validateEnableButton()
          ? styles.buttonEnable
          : styles.buttonDisable
      ]}
      disabled={!this._validateEnableButton()}
      onPress={() =>
        this.props.navigation.navigate("AddImage", {
          data: Object.assign({}, data, {
            availableTimeRanges: timeRanges.map(item => {
              delete item.id;
              return item;
            }),
            dailyPrice: parseInt(this.state.dailyPrice)
          })
        })
      }
    >
      <Text style={styles.textEnable}>Next</Text>
      <Ionicons
        name="ios-arrow-forward"
        size={23}
        color={"white"}
        style={{ marginTop: 3 }}
      />
    </TouchableOpacity>
  );

  render() {
    const { beginDate, endDate, timeRanges, calendarIndex } = this.state;
    const { data } = this.props.navigation.state.params;
    const upperPrice = this.state.suggestPrice * 1.15;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Available time range</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {!this.state.loading ? (
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.price}>Price per day (K):</Text>
              <Text style={styles.price}>
                Suggested price: {Math.round(this.state.suggestPrice)} ~{" "}
                {Math.round(upperPrice)}
              </Text>
              <TextInput
                placeholder={"Input your price"}
                keyboardType={"numeric"}
                onChangeText={value => this.setState({ dailyPrice: value })}
                style={styles.placeholder}
              />
              {this.state.timeRanges.map((item, index) =>
                this._renderDateRange(item, index)
              )}
              {this._renderCalendar(
                calendarIndex,
                Date.now(),
                this._handleAddMoreMonth(Date.now(), 3)
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonPlus}
                onPress={this._handleAddMore}
              >
                <Feather name="plus" size={24} color={"white"} />
              </TouchableOpacity>
            </View>
          ) : (
            <Loading />
          )}
        </ScrollView>
        <View style={styles.bottomWrapper}>
          {this._renderBottomButton(data, timeRanges)}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  timeRangeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 80
  },
  bottomWrapper: {
    backgroundColor: "transparent",
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  buttonWrapper: {
    marginRight: 15,
    paddingVertical: 5,
    width: 90,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  textEnable: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: "white",
    marginRight: 8
  },
  buttonEnable: {
    backgroundColor: colors.primaryColor
  },
  buttonDisable: {
    backgroundColor: colors.text25
  },
  buttonPlus: {
    backgroundColor: "green",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  textRemove: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "red"
  },
  text: {
    color: colors.text50,
    fontSize: fontSize.caption,
    height: 15,
    fontWeight: "500",
    marginBottom: 5
  },
  price: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    marginBottom: 5,
    color: colors.primaryColor
  },
  placeholder: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "500",
    paddingBottom: 10,
    borderBottomColor: colors.text25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    marginBottom: 15
  }
});

export default AddDuration;
