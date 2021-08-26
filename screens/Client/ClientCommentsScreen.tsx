import React from "react";
import {
  LogBox,
  RefreshControl,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import {
  deleteComment,
  getListComment,
  getListCommentOfNhathuoc,
} from "../../api/RatingCommentApis";
import { getListReply, getListReplyByNhathuoc, postReply } from "../../api/ReplyApis";
import { AuthContext } from "../../components/ContextLogin";

const MedicineListScreen = ({ navigation }) => {
  LogBox.ignoreAllLogs();
  const [listData, setListData] = React.useState([]);
  const [listComment, setListComment] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const context = React.useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  nhathuoc === null ? (
    navigation.navigate("SignInScreen")
  ) : null;

  const getData = (manhathuoc: string) => {
    getListReplyByNhathuoc(manhathuoc)
      .then((res) => {
        // console.log(res.data);
        setListData(res.data);
      })
      .catch((e) => {
        Alert.alert("Fail!", "Not found Data", [{ text: "ok" }]);
      });
  };

  const getComments = (manhathuoc: string) => {
    getListCommentOfNhathuoc(manhathuoc)
      .then((res) => {
        // console.log(res.data);
        setListComment(res.data.reverse());
      })
      .catch((e) => {
        Alert.alert("Fail!", "Not found Data", [{ text: "ok" }]);
      });
  };

  React.useEffect(() => {
    async function use() {
      await getData(nhathuoc.manhathuoc);
      await getComments(nhathuoc.manhathuoc);
    }
    use();
    
    console.log(nhathuoc.manhathuoc);
  }, [refreshing]);

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

  const doDeleteComment = (id: number) => {
    Alert.alert("Notice!", "Are you want delete for this comment?", [
      {
        text: "Approve",
        onPress: async () => {
          await deleteComment(id)
            .then((res) => {
              Alert.alert("Success", "Success!", [{ text: "ok" }]);
              // setModalVisible(!modalVisible);
              // setInputValue("");
            })
            .catch((e) => {
              console.log(id);
              console.log(e);
              Alert.alert("Fail", "Cannot delete comment has replied! ", [
                { text: "ok" },
              ]);
            });
        },
      },
      {
        text: "Cancel",
      },
    ]);
  };

  const renderItem = (item) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            // console.log("TESSSSSSSSSSSSSSSSSSSSSSS");
            // setTemp({item, nhanvien});
            // setModalVisible(!modalVisible);
            navigation.navigate("DetailCommentClientScreenN", item)
          }}
          onLongPress={()=>doDeleteComment(item.id)}
        >
          {console.log(item)}
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                Mã NT: {item.nhathuoc.manhathuoc} - ID:{item.id} - 
                {listData.some(rep => rep.binhluan.id === item.id) === true ? "Replied" : "Waiting"}
              </Text>
              <Text style={styles.cardTitle}>
                Sản phẩm: {item.sanpham.masp} - {item.sanpham.tensp}
              </Text>
              <Text style={styles.cardTitle}>Thời gian: {item.time}</Text>
              <Text numberOfLines={2} style={styles.cardDetails}>
                Nội dung: {item.noidung}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <FlatList
        data={listComment}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={({item}) => "key" + item.id}
      />
    </ScrollView>
  );
};

export default MedicineListScreen;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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

  //
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: "row",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDetails: {
    marginTop: 6,
    fontSize: 12,
    color: "#444",
  },
});
