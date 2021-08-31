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
  LogBox,
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
  putComment,
} from "../../../api/RatingCommentApis";
import { AirbnbRating, Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { getListOrderByClient } from "../../../api/OrderApis";
const { width } = Dimensions.get("window");
// import { Image } from "react-native-animatable";

const DetailProductScreen = ({ navigation, route }) => {
  LogBox.ignoreAllLogs();
  const medicine = route.params;
  const [count, setCount] = useState(1);
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  var ma;
  nhathuoc !== null ? (ma = nhathuoc.manhathuoc) : "";
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

  const renderComment = (item, navigation) => {
    return (
      // console.log("CHECK")
      // console.log(item, index)
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          {nhathuoc !== null &&
          item.nhathuoc.manhathuoc === nhathuoc.manhathuoc ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              {/* <TouchableOpacity
                onPress={() =>
                  // editComment(medicine, nhathuoc, inputValue, getDate())
                  editComment(item)
                }
              >
                <Icon
                  name="edit"
                  style={{ fontSize: 20, justifyContent: "flex-end" }}
                />
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => deleteMyComment(item.id)}>
                <Icon
                  name="delete"
                  style={{ fontSize: 20, justifyContent: "flex-end" }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            style={[style.card, style.commentCard]}
            onPress={() => {
              navigation.navigate("DetailCommentClientScreen", item);
            }}
          >
            <Text>
              {item.nhathuoc.tennhathuoc}: {item.noidung}
            </Text>
            <Text style={{ fontSize: 12 }}>Ngày: {item.time}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const addCart = async (manhathuoc: string, masp: string, soluong: number) => {
    await postCart(manhathuoc, masp, soluong)
      .then((res) => {
        Alert.alert("Submit Info", "Success!", [{ text: "ok" }]);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Failed", "this Product not enough quantity!", [
          { text: "ok" },
        ]);
      });
  };

  const [reviewed, setReviewed] = useState(false);

  const getCommentsOfProduct = (masp: string, mant: string) => {
    getListCommentOfProduct(masp)
      .then((res) => {
        // console.log("comments", res.data);
        const check = res.data.some((e) => {
          return e.nhathuoc.manhathuoc === mant;
        });
        // console.log("check", check);
        setReviewed(check);
        if (res.data === []) setReviewed(false);
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

  const [canReview, setCanReview] = useState(false);

  const isOrdered = (mant: string, masp: string) => {
    getListOrderByClient(mant)
      .then((res) => {
        res.data.map((item) => {
          if (
            item.listCTDH.filter((e) => {
              e.sanpham.masp === masp;
            })
          ) {
            // console.log(masp);
            setCanReview(true);
          }
        });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Failed", "Cannot get orders of client! " + e, [
          { text: "ok" },
        ]);
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

  const editComment = (
params
  ) => {
    // var params = {
    //   sanpham,
    //   nhathuoc,
    //   noidung,
    //   time,
    // };
    toggleModalVisibility();
    putComment(params)
      .then((res) => {
        // console.log(res.data);
        // setRatings(res.data.danhgia);
        Alert.alert("Success", "Comment has Edited ! ", [{ text: "ok" }]);
      })
      .catch((e) => {
        console.log(params);
        console.log(e);
        Alert.alert("Failed", "Cannot Edit Comment! " + e, [{ text: "ok" }]);
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
    isOrdered(nhathuoc.manhathuoc, medicine.masp);
    getRatingOfProduct(medicine.masp);
    getCommentsOfProduct(medicine.masp, nhathuoc.manhathuoc);
    {
      nhathuoc !== null
        ? clientRated(nhathuoc.manhathuoc, medicine.masp)
        : null;
    }
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

  function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }

  const [quantity, setQuantity] = useState();

  const changeQuantity = (val: number) => {
    if (val > medicine.soluong) Alert.alert("Failed, Out of product quantity!");
    else if (val < 1)
      Alert.alert("Failed, Quantity of product must be more than zero!");
    else {
      setCount(val);
      // setQuantity(val);
    }
  };

  if (medicine)
    return (
      <View>
        {console.log(count)}
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
            <Text style={style.headerText}>Detail Product</Text>
            <Icon
              name="shopping-cart"
              size={28}
              onPress={() =>
                nhathuoc !== null
                  ? navigation.navigate("CartScreen")
                  : Alert.alert("Notice", "Please, Login!")
              }
            />
          </View>

          <View style={style.imageContainer}>
            <Image source={{ uri: medicine.photo }} style={{ flex: 1 }} />
            <Rating
              type="star"
              ratingBackgroundColor="transparent"
              ratingColor="transparent"
              showRating={true}
              showReadOnlyText={false}
              ratingCount={5}
              imageSize={30}
              startingValue={ratings}
              minValue={0}
              readonly={true}
              // tintColor='transparent'
              tintColor={COLORS.white}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
          <View></View>
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
                  {currencyFormat(medicine.dongia)}
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
              <Text
                style={{
                  color: "grey",
                  fontSize: 16,
                  lineHeight: 22,
                  marginTop: 10,
                }}
              >
                Số lượng tồn: {medicine.soluong}
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
                    onPress={() => {
                      // if (nhathuoc !== null) {
                      count > 0
                        ? setCount(parseInt(count) - 1)
                        : Alert.alert("Failed, Cannot input negative!");
                      // } else {
                      //   Alert.alert("Notice", "Please, Login!");
                      // }
                    }}
                  >
                    <View style={style.borderBtn}>
                      <Text style={style.borderBtnText}>-</Text>
                    </View>
                  </TouchableOpacity>
                  {/* <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {count}
                  </Text> */}

                  <TextInput
                    style={{
                      fontSize: 20,
                      marginHorizontal: 10,
                      fontWeight: "bold",
                    }}
                    keyboardType="number-pad"
                    value={count.toString()}
                    // onChange={(val) => changeQuantity(val)}
                    onChangeText={(val) => changeQuantity(val)}
                  />

                  {/* CHECK SO LUONG TON */}
                  <TouchableOpacity
                    onPress={() => {
                      // if (nhathuoc !== null)
                      medicine.soluong > count
                        ? setCount(parseInt(count) + 1)
                        : Alert.alert("Failed, Out of product quantity!");
                      // else {
                      //   Alert.alert("Notice", "Please, Login!");
                      // }
                    }}
                  >
                    <View style={style.borderBtn}>
                      <Text style={style.borderBtnText}>+</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (nhathuoc !== null) {
                      count <= medicine.soluong && count !== 0
                        ? addCart(ma, medicine.masp, count)
                        : Alert.alert(
                            "Notice",
                            "Out of quantity this product!"
                          );
                    } else Alert.alert("Notice", "Please, Login!");
                  }}
                >
                  <View style={style.buyBtn}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Add To Cart
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* RATINGS */}
          {canReview === true ? (
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
                onFinishRating={(val) =>
                  nhathuoc !== null
                    ? postRatingProduct(medicine, nhathuoc, val)
                    : Alert.alert("Notice", "Please, Login!")
                }
              />
            </View>
          ) : null}

          {/* COMMENTS */}
          <View style={{ paddingHorizontal: 10 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={[style.headerText, { marginTop: 30 }]}>Reviews</Text>
            </View>
            <FlatList
              data={comments}
              renderItem={({ item }) => renderComment(item, navigation)}
              contentContainerStyle={style.commentsContainer}
              keyExtractor={(e) => "key" + e.id}
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
                          nhathuoc !== null
                            ? addComment(
                                medicine,
                                nhathuoc,
                                inputValue,
                                getDate()
                              )
                            : Alert.alert("Notice", "Please, Login!")
                        }
                        style={[style.button, style.buttonOpen, { margin: 10 }]}
                      >
                        <Text style={{ color: COLORS.white }}>Review</Text>
                      </Pressable>
                      <Pressable
                        onPress={toggleModalVisibility}
                        style={[
                          style.button,
                          style.buttonClose,
                          { margin: 10 },
                        ]}
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
              {console.log("canreview", canReview)}
              {console.log("reviewed", reviewed)}
              {canReview === true && reviewed === false ? (
                <TouchableOpacity onPress={toggleModalVisibility}>
                  <Ionicons
                    name="add-circle-outline"
                    style={{ fontSize: 50 }}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
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
