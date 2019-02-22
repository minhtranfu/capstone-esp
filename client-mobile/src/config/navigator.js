import React, { Component } from "react";
import { Image } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import DismissableStackNav from "../Utils/DismissableStackNav";
import colors from "./colors";

import Discover from "../screens/Discover";
import Account from "../screens/Account";
import Profile from "../screens/Account/Profile";
import Construction from "../screens/Account/Construction";
import ConstructionDetail from "../screens/Account/Detail";
import Feedback from "../screens/Account/Feedback";
import CallOrTextUs from "../screens/Account/CallOrTextUs";
import AboutUs from "../screens/Account/AboutUs";
import Search from "../screens/Search";
import SearchResult from "../screens/Search/SearchResult";
import MyTransaction from "../screens/MyTransaction";
import MyTransactionDetail from "../screens/MyTransaction/Detail";
import EquipmentDetail from "../screens/EquipmentDetail";
import Transaction from "../screens/EquipmentDetail/Transaction";
import Activity from "../screens/Activity";
import ActivityDetail from "../screens/Activity/Detail";
import Notification from "../screens/Activity/Notification";
import ButtonWithIcon from "../components/ButtonWithIcon";
import MyEquipment from "../screens/MyEquipment";
import MyEquipmentDetail from "../screens/MyEquipment/Detail";
import AddDetail from "../screens/MyEquipment/AddEquipment/AddDetail";
import AddDuration from "../screens/MyEquipment/AddEquipment/AddDuration";
import AddDurationText from "../screens/MyEquipment/AddEquipment/AddDurationText";
import AddImage from "../screens/MyEquipment/AddEquipment/AddImage";

const EquipmentDetailStack = createStackNavigator(
  {
    EquipmentDetail: EquipmentDetail
  },
  {
    headerMode: "none"
  }
);

const DiscoverStack = createStackNavigator(
  {
    Discover: Discover,
    Detail: EquipmentDetail,
    Transaction: Transaction,
    Search: Search,
    Result: SearchResult
  },
  {
    headerMode: "none"
  }
);

DiscoverStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "Detail") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const AccountStack = createStackNavigator(
  {
    Account: Account,
    Profile: Profile,
    Feedback: Feedback,
    CallOrTextUs: CallOrTextUs,
    AboutUs: AboutUs,
    Construction: Construction,
    ConstructionDetail: ConstructionDetail
  },
  {
    headerMode: "none"
  }
);

const SearchStack = createStackNavigator(
  {
    Search: Search
  },
  {
    headerMode: "none"
  }
);

const AddNewEquipmentStack = DismissableStackNav(
  {
    AddDetail: AddDetail,
    AddDuration: AddDuration,
    AddDurationText: AddDurationText,
    AddImage: AddImage
  },
  {
    headerMode: "none",
    initialRouteName: "AddDetail"
  }
);

const MyEquipmentStack = createStackNavigator(
  {
    MyEquipment: MyEquipment,
    MyEquipmentDetail: MyEquipmentDetail,
    AddNewEquipment: AddNewEquipmentStack
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "MyEquipment"
  }
);

MyEquipmentStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == "AddNewEquipment") {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

const MyTransactionStack = createStackNavigator(
  {
    MyTransaction: MyTransaction,
    MyTransactionDetail: MyTransactionDetail
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "MyTransaction"
  }
);

const ActivityStack = createStackNavigator(
  {
    Activity: Activity,
    Notification: Notification,
    Detail: ActivityDetail
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "Activity"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Discover: DiscoverStack,
    Activity: ActivityStack,
    Equipment: MyEquipmentStack,
    Transaction: MyTransactionStack,
    Account: AccountStack
  },
  {
    initialRouteName: "Account",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let icon;
        if (routeName === "Discover") {
          icon = focused
            ? require("../../assets/icons/icons8-compass-active.png")
            : require("../../assets/icons/icons8-compass.png");
        } else if (routeName === "Activity") {
          icon = focused
            ? require("../../assets/icons/icons8-activity-active.png")
            : require("../../assets/icons/icons8-activity.png");
        } else if (routeName === "Equipment") {
          icon = focused
            ? require("../../assets/icons/icons8-garage-active.png")
            : require("../../assets/icons/icons8-garage.png");
        } else if (routeName === "Transaction") {
          icon = focused
            ? require("../../assets/icons/icons8-transaction-active.png")
            : require("../../assets/icons/icons8-transaction.png");
        } else if (routeName === "Account") {
          icon = focused
            ? require("../../assets/icons/icons8-settings-active.png")
            : require("../../assets/icons/icons8-settings.png");
        }

        return (
          <Image
            source={icon}
            style={{
              height: 29,
              aspectRatio: 1,
              marginTop: 2
            }}
            resizeMode={"contain"}
          />
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.secondaryColor,
      inactiveTintColor: colors.white,
      style: {
        backgroundColor: colors.primaryColor
      }
    }
  }
);

const AppNavigator = createSwitchNavigator({
  App: TabNavigator
});

export default createAppContainer(AppNavigator);
