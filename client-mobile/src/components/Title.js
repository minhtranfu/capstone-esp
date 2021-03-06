import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class Title extends Component {
  static propTypes = {
    title: PropTypes.string,
    hasMore: PropTypes.string
  };
  render() {
    const { title, hasMore, titleStyle, style, onPress } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.text, titleStyle]}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.hasMoreText}>
            {hasMore ? hasMore || "More" : null}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    paddingTop: 15,
    paddingBottom: 10
  },
  hasMoreText: {
    color: colors.secondaryColor,
    fontSize: fontSize.secondaryText,
    fontWeight: "500"
  }
});

export default Title;
