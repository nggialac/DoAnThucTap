import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  LogBox,
} from "react-native";
import COLORS from "../../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  deleteReply,
  getListReply,
  getListReplyOfComment,
  postReply,
} from "../../../api/ReplyApis";
import Icon from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from "../../../components/ContextLogin";

const { width } = Dimensions.get("window");

const DetailCommentClientScreen = ({ navigation, route }) => {
  const comments = route.params;
  LogBox.ignoreAllLogs();
  // console.log(comments);
  const [listData, setListData] = React.useState();

  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;

  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  const getData = (id: number) => {
    getListReplyOfComment(id)
      .then((res) => {
        // console.log(res.data);
        setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "Not found Data", [{ text: "ok" }]);
      });
  };

  function getDate() {
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth() + 1];
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = year + "-" + month + "-" + day;
    // console.log(output);
    return output;
  }

  useEffect(() => {
    getData(comments.id);
    // console.log(comments);
  }, [refreshing]);

  const renderComment = ({ item, index }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* {console.log(item)} */}

        <TouchableOpacity style={[style.card, style.commentCard]}>
          <Text>
            {item.nhanvien.ten}: {item.noidung}
          </Text>
          <Text>Ngày: {item.time}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ paddingHorizontal: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ alignItems: "center" }}>
        <Text style={[style.headerText, { marginTop: 50 }]}>
          Client's Comment
        </Text>
      </View>
      {/* COMMENT OF NT */}
      <View style={{ marginBottom: 50 }}>
        {/* {console.log(comments)} */}
        <TouchableOpacity style={[style.card, style.commentCard]}>
          <Text>
            {comments.nhathuoc.manhathuoc}: {comments.noidung}
          </Text>
          <Text>Ngày: {comments.time}</Text>
        </TouchableOpacity>
      </View>
      {/* COMMENT OF NV */}
      <View style={{ alignItems: "center" }}>
        <Text style={[style.headerText, { marginTop: 50 }]}>Reply Comment</Text>
      </View>
      <FlatList
        data={listData}
        renderItem={renderComment}
        contentContainerStyle={style.commentsContainer}
        // keyExtractor={(e) => e.id.toString()}
      />
    </ScrollView>
  );
};

const style = StyleSheet.create({
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  borderBtn: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
  },
  borderBtnText: { fontWeight: "bold", fontSize: 28 },
  buyBtn: {
    width: 130,
    height: 50,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  commentsContainer: {
    padding: 8,
  },
  commentCard: {
    padding: 16,
    marginVertical: 8,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.8)",
    borderWidth: 1,
    marginBottom: 8,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#16c90a",
  },
  buttonClose: {
    backgroundColor: "#05375a",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DetailCommentClientScreen;
