import React, { useState, useContext, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
// import { CommentCard } from "./CommentCard";
import { postCart } from "../../../api/CartApis";
import { AuthContext } from "../../../components/ContextLogin";
import {
  getListComment,
  getListCommentOfProduct,
  getRatingOfNT,
  getRatingsByProduct,
  postComment,
  postRating,
  deleteComment,
} from "../../../api/RatingCommentApis";
import { AirbnbRating, Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
const { width } = Dimensions.get("window");
// import { Image } from "react-native-animatable";

const DetailProductScreen = ({ navigation, route }) => {
  const medicine = route.params;
  const [count, setCount] = useState(1);
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const ma = nhathuoc.manhathuoc;
  // console.log(ma);

  const [ratings, setRatings] = useState();
  const [rated, setRated] = useState(0);
  const [comments, setComments] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const renderComment = ({ item, index }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        {item.nhathuoc.manhathuoc === nhathuoc.manhathuoc ? (
          <TouchableOpacity onPress={() => deleteMyComment(item.id)}>
            <Icon
              name="delete"
              style={{ fontSize: 20, justifyContent: "flex-end" }}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={[style.card, style.commentCard]}>
          <Text>
            {item.nhathuoc.tennhathuoc}: {item.noidung}
          </Text>
          <Text>
            Mã:{item.id} - Ngày: {item.time}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const addCart = (manhathuoc: string, masp: string, soluong: number) => {
    postCart(manhathuoc, masp, soluong)
      .then((res) => {
        Alert.alert("Submit Info", "Success!", [{ text: "ok" }]);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Submit Info", "Fail!" + e, [{ text: "ok" }]);
      });
  };

  const getCommentsOfProduct = (masp: string) => {
    getListCommentOfProduct(masp)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail", "Cannot get comments " + e, [{ text: "ok" }]);
      });
  };

  const addComment = (
    sanpham: object,
    nhathuoc: object,
    noidung: string,
    time: string
  ) => {
    var params = {
      sanpham,
      nhathuoc,
      noidung,
      time,
    };
    postComment(params)
      .then((res) => {
        Alert.alert("Success", "Success!", [{ text: "ok" }]);
        toggleModalVisibility();
        setInputValue("");
      })
      .catch((e) => {
        console.log(params);
        console.log(e);
        Alert.alert("Fail", "Cannot create comment " + e, [{ text: "ok" }]);
      });
  };

  const getRatingOfProduct = (masp: string) => {
    getRatingsByProduct(masp)
      .then((res) => {
        console.log(res.data);
        let obj = res.data;
        let temp = Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
        // console.log(temp);
        var check = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5,
        };
        let max;
        for (let key in check) {
          if (key === temp) {
            max = check[key];
          }
        }
        setRatings(max);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail", "Cannot get ratings " + e, [{ text: "ok" }]);
      });
  };

  const clientRated = (mant: string, masp: string) => {
    getRatingOfNT(mant, masp)
      .then((res) => {
        console.log(res.data);
        setRated(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail", "Cannot get ratings " + e, [{ text: "ok" }]);
      });
  };

  const postRatingProduct = (
    sanpham: object,
    nhathuoc: object,
    danhgia: any
  ) => {
    var params = {
      sanpham,
      nhathuoc,
      danhgia,
      id: {
        masp: sanpham.masp,
        manhathuoc: nhathuoc.manhathuoc,
      },
    };
    postRating(params)
      .then((res) => {
        console.log(res.data);
        setRatings(res.data.danhgia);
      })
      .catch((e) => {
        console.log(params);
        console.log(e);
        Alert.alert("Fail", "Cannot get ratings " + e, [{ text: "ok" }]);
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
    getRatingOfProduct(medicine.masp);
    getCommentsOfProduct(medicine.masp);
    clientRated(nhathuoc.manhathuoc, medicine.masp);
  }, [refreshing]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  const deleteMyComment = (id: number) => {
    deleteComment(id)
      .then((res) => {
        console.log(res.data);
        Alert.alert("Success!", "Comment has deleted", [{ text: "ok" }]);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Fail!", "Cannot delete after admin reply... ", [
          { text: "ok" },
        ]);
      });
  };

  // const [quantity, setQuantity] = useState(3);
  // const seeMore = (comments) => {
  //   comments.slice(0, quantity);
  //   setQuantity(quantity+3);
  // }

  const format = (value: number) => {
    let val = value.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    return val;
  };

  if (medicine)
    return (
      <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        <View style={style.header}>
          <Icon
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
          />
          <Text style={style.headerText}>Hello</Text>
          <Icon name="shopping-cart" size={28} />
        </View>
        
        <View style={style.imageContainer}>

          <Image
            source={{ uri: medicine.photo }}
            style={{ flex: 1 }}
          />
                      <Rating
            type="star"
            ratingBackgroundColor='transparent'
            ratingColor='transparent'
            showRating={true}
            showReadOnlyText={false}
            ratingCount={5}
            imageSize={30}
            startingValue={ratings}
            minValue={0}
            readonly={true}
            // tintColor='transparent'
            tintColor={COLORS.white}
            style={{backgroundColor: 'transparent'}}
          />
        </View>
        <View>
        </View>
        <View style={style.detailsContainer}>
          <View
            style={{
              marginLeft: 20,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            {/* <View style={style.line} /> */}

          </View>
          <View
            style={{
              marginLeft: 20,
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              {medicine.tensp}
            </Text>
            <View style={style.priceTag}>
              <Text
                style={{
                  marginLeft: 15,
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {format(medicine.dongia)}Đ
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {medicine.mota_ngan}
            </Text>
            <Text
              style={{
                color: "grey",
                fontSize: 16,
                lineHeight: 22,
                marginTop: 10,
              }}
            >
              {medicine.mota_chitiet}
            </Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    count > 0 ? setCount(count - 1) : setCount(count)
                  }
                >
                  <View style={style.borderBtn}>
                    <Text style={style.borderBtnText}>-</Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    marginHorizontal: 10,
                    fontWeight: "bold",
                  }}
                >
                  {count}
                </Text>
                {/* CHECK SO LUONG TON */}
                <TouchableOpacity onPress={() => setCount(count + 1)}>
                  <View style={style.borderBtn}>
                    <Text style={style.borderBtnText}>+</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => addCart(ma, medicine.masp, count)}
              >
                <View style={style.buyBtn}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Buy
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RATINGS */}
        <View style={{ paddingHorizontal: 10, alignItems: "center" }}>
          <Text style={[style.headerText, { marginTop: 30 }]}>
            Rating for product
          </Text>
          <AirbnbRating
            // ratingBackgroundColor=
            showRating
            count={5}
            reviews={["Terrible", "Bad", "Meh", "OK", "Good"]}
            size={20}
            defaultRating={rated}
            onFinishRating={(val) => postRatingProduct(medicine, nhathuoc, val)}
          />
        </View>

        {/* COMMENTS */}
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={[style.headerText, { marginTop: 30 }]}>Comments</Text>
          </View>
          <FlatList
            data={comments}
            renderItem={renderComment}
            contentContainerStyle={style.commentsContainer}
            // keyExtractor={(e) => e.id.toString()}
          />

          {/* MODAL */}
          <View>
            <Modal
              animationType="slide"
              transparent
              visible={isModalVisible}
              presentationStyle="overFullScreen"
              onDismiss={toggleModalVisibility}
            >
              <View style={style.viewWrapper}>
                <View style={style.modalView}>
                  <TextInput
                    placeholder="Enter something..."
                    value={inputValue}
                    style={style.textInput}
                    onChangeText={(value) => setInputValue(value)}
                  />

                  {/** This button is responsible to close the modal */}
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      onPress={() =>
                        addComment(medicine, nhathuoc, inputValue, getDate())
                      }
                      style={[style.button, style.buttonOpen, { margin: 10 }]}
                    >
                      <Text style={{ color: COLORS.white }}>Comment</Text>
                    </Pressable>
                    <Pressable
                      onPress={toggleModalVisibility}
                      style={[style.button, style.buttonClose, { margin: 10 }]}
                    >
                      <Text style={{ color: COLORS.white }}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          {/* <Pressable
            onPress={toggleModalVisibility}
            style={[style.button, style.buttonClose, { alignItems: "center" }]}
          >
            <Text style={{ color: COLORS.white }}>Pop Up</Text>
          </Pressable> */}

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={toggleModalVisibility}>
              <Ionicons name="add-circle-outline" style={{ fontSize: 50 }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
    );
};

const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: "center",
    // alignItems: "center",
    // minHeight: 120,
    height: 350,
  },
  detailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
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
  priceTag: {
    backgroundColor: COLORS.green,
    width: 100,
    height: 40,
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
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
});

export default DetailProductScreen;
