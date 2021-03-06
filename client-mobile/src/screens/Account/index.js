import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Switch,
  Image as RNImage,
  RefreshControl,
  ActionSheetIOS
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SafeAreaView } from "react-navigation";
import axios from "axios";
import { Notifications, Permissions, Camera } from "expo";
import { Ionicons } from "@expo/vector-icons";
import i18n from "i18n-js";

import {
  getConstructionList,
  getContractorDetail
} from "../../redux/actions/contractor";
import { logOut } from "../../redux/actions/auth";
import {
  deleteNoticationToken,
  allowPushNotification
} from "../../redux/actions/notification";

import Login from "../Login";
import SettingItem from "./components/SettingItem";
import Loading from "../../components/Loading";
import {
  Header,
  Left,
  Right,
  Button as HeaderButton,
  Body
} from "../../components/AnimatedHeader";
import LogoutIcon from "../../../assets/icons/icons8-export.png";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import { ACTION_NIGHT_DISPLAY_SETTINGS } from "expo/build/IntentLauncherAndroid";

const SETTING_ITEMS_VALUE = [
  {
    id: 1,
    value: "EditProfile",
    code: "Profile"
  },
  {
    id: 2,
    value: "ChangePassword",
    code: "ChangePassword"
  },
  {
    id: 3,
    value: "ChangeLanguage",
    code: "ChangeLanguage"
  },
  {
    id: 4,
    value: "MyFeedback",
    code: "MyFeedback"
  },
  {
    id: 5,
    value: "MyConstruction",
    code: "Construction"
  },
  {
    id: 6,
    value: "MySubscription",
    code: "Subscription"
  },
  {
    id: 7,
    value: "Notifications",
    code: "Notifications"
  }
];

@connect(
  state => {
    return {
      isLoggedIn: state.auth.userIsLoggin,
      contractor: state.contractor.detail,
      loading: state.contractor.loading,
      user: state.auth.data,
      allowPushNotification: state.notification.allowPushNotification,
      language: state.contractor.language
    };
  },
  dispatch =>
    bindActionCreators(
      {
        fetchLogout: logOut,
        fetchGetConstructionList: getConstructionList,
        fetchGetContractorDetail: getContractorDetail,
        fetchRemoveNotiToken: deleteNoticationToken,
        fetchAllowPushNotification: allowPushNotification
      },
      dispatch
    )
)
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      switchValue: null,
      refreshing: false,
      hasCameraPermission: null
    };
  }

  async componentDidMount() {
    const { user, isLoggedIn } = this.props;
    console.log("ahihi user", user);
    if (isLoggedIn) {
      this.props.fetchGetConstructionList(user.contractor.id);
      this.props.fetchGetContractorDetail(user.contractor.id);
      if (this.state.switchValue === true) {
        await this._handlePermissionNotification();
        await this._registerForPushNotificationsAsync();
      } else {
        this._handleRemoveToken();
      }
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.allowPushNotification && state.switchValue === null) {
      return {
        switchValue: nextProps.allowPushNotification
      };
    }
    return null;
  }

  async componentDidUpdate(prevProps) {
    // Check if user is first time login
    if (this.props.isLoggedIn && Object.keys(prevProps.user).length === 0) {
      this.props.fetchGetContractorDetail(this.props.user.contractor.id);
    } else {
      console.log(prevProps.user);
    }
    //Check if user is login so access push notification
    if (this.props.isLoggedIn && this.state.switchValue === true) {
      await this._handlePermissionNotification();
      await this._registerForPushNotificationsAsync();
    } else if (this.props.isLoggedIn && this.state.switchValue === false) {
      this._handleRemoveToken();
    }
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    const { user } = this.props;
    const res = await this.props.fetchGetContractorDetail(user.contractor.id);
    if (res) {
      this.setState({ refreshing: false });
    } else {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    }
  };

  _handlePermissionNotification = async () => {
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    console.log("final", finalStatus);
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
    this.props.fetchAllowPushNotification();
  };

  _registerForPushNotificationsAsync = async () => {
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    if (token) {
      const notiToken = {
        registrationToken: token,
        deviceType: "EXPO"
      };
      axios.post(`notificationTokens`, notiToken).then(
        res => {
          AsyncStorage.setItem("NotiToken", res.data.id.toString());
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  _handleRemoveToken = async () => {
    const tokenId = await AsyncStorage.getItem("NotiToken");
    if (tokenId) {
      await this.props.fetchRemoveNotiToken(tokenId);
      AsyncStorage.removeItem("NotiToken");
    }
  };

  _handleLogout = async () => {
    await this._handleRemoveToken();
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRefreshToken");
    this.props.fetchLogout();
  };

  _handleOnSwitchChange = value => {
    this.setState({ switchValue: value });
  };

  _renderImageProfile = thumbnailImage => (
    <View style={{ flex: 1 }}>
      <Image
        uri={
          "https://www.bimcommunity.com/files/images/userlib/construction_trends_bimcommunity.jpg"
        }
        style={styles.thumbnail}
        resizeMode={"cover"}
      />
      <View style={styles.avatarWrapper}>
        <Image
          uri={
            thumbnailImage
              ? thumbnailImage
              : "http://bootstraptema.ru/snippets/icons/2016/mia/2.png"
          }
          resizeMode={"cover"}
          style={styles.avatar}
        />
      </View>
    </View>
  );

  _dateConverter = timeStamp => {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    let date = new Date(timeStamp);
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let day = date.getDay();
    return month + " " + day + ", " + year;
  };

  render() {
    const { isLoggedIn, contractor, loading, user } = this.props;
    if (isLoggedIn) {
      if (!contractor) return <Loading />;
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "never", top: "always" }}
        >
          <Header style={{ position: "relative" }}>
            <Left />
            <Body title={i18n.t("Settings")} />
            <Right>
              <TouchableOpacity onPress={this._handleLogout}>
                <RNImage
                  source={LogoutIcon}
                  style={{ width: 22, height: 22, marginRight: 5 }}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            </Right>
          </Header>
          {!loading ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <View>
                {this._renderImageProfile(contractor.thumbnailImageUrl)}
                <View style={styles.nameWrapper}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.name}>{contractor.name}</Text>
                    {contractor.status === "ACTIVATED" ? (
                      <RNImage
                        source={require("../../../assets/icons/icons8-checked.png")}
                        style={{ marginLeft: 5, width: 20, height: 20 }}
                      />
                    ) : (
                      <RNImage
                        source={require("../../../assets/icons/icons8-warning.png")}
                        style={{ marginLeft: 5, width: 20, height: 20 }}
                      />
                    )}
                  </View>
                  {contractor.status !== "ACTIVATED" ? (
                    <Text style={styles.text}>Waiting For Verify</Text>
                  ) : null}
                  <Text style={styles.text}>
                    {i18n.t("Joined")}{" "}
                    {this._dateConverter(contractor.createdTime)}
                  </Text>
                </View>
                <View style={styles.contentWrapper}>
                  {contractor.status === "NOT_VERIFIED" ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        this.props.navigation.navigate("VerifyAccount", {
                          contractorId: contractor.id
                        })
                      }
                    >
                      <Text style={styles.verifyText}>Verify your account</Text>
                      <Ionicons name="ios-arrow-forward" size={20} />
                    </TouchableOpacity>
                  ) : null}
                  {SETTING_ITEMS_VALUE.map(item => (
                    <SettingItem
                      key={item.id}
                      status={contractor.status}
                      // onVerifyPress={() =>
                      //   this.props.navigation.navigate("Verify", {
                      //     contractorId: contractor.id
                      //   })
                      // }
                      value={i18n.t(item.value)}
                      onSwitchValue={this.state.switchValue}
                      onSwitchChange={this._handleOnSwitchChange}
                      onPress={() =>
                        this.props.navigation.navigate(item.code, {
                          contractorId: contractor.id
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          ) : (
            <Loading />
          )}
        </SafeAreaView>
      );
    } else {
      return <Login navigation={this.props.navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.text25
  },
  contentWrapper: {
    paddingHorizontal: 15
  },
  avatarWrapper: {
    marginTop: -40,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  nameWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: colors.primaryColor,
    paddingVertical: 8
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: colors.secondaryColor
  },
  thumbnail: {
    height: 145
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  name: {
    fontSize: fontSize.h3,
    fontWeight: "700"
  },
  text: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400"
  },
  verifyText: {
    fontSize: fontSize.secondaryText,
    fontWeight: "400"
  }
});

export default Account;
