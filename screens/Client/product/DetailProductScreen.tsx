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
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
import { CommentCard } from "./CommentCard";
import { postCart } from "../../../api/CartApis";
import { AuthContext } from "../../../components/ContextLogin";
import {
  getListComment,
  getListCommentOfProduct,
  getRatingOfNT,
  getRatingsByProduct,
  postComment,
  postRating,
} from "../../../api/RatingCommentApis";
import { AirbnbRating, Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
// import { Image } from "react-native-animatable";

const DetailProductScreen = ({ navigation, route }) => {
  const medicine = route.params;
  const [count, setCount] = useState(1);
  const context = useContext(AuthContext);
  const nhathuoc = context.loginState.mnv_mnt;
  const ma = nhathuoc.manhathuoc;
  // console.log(ma);

  const [ratings, setRatings] = useState(0);
  const [rated, setRated] = useState(0);
  const [comments, setComments] = useState([]);

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
    time: string,
    id: number
  ) => {
    var params = {
      sanpham,
      nhathuoc,
      id,
      noidung,
      time,
    };
    // params["sanpham"] = sanpham;
    // params["nhathuoc"] = nhathuoc;

    postComment(params)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
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
        let temp = Object.keys(obj).reduce((a, b) => (obj[a] > obj[b]) ? a : b);
        // console.log(temp);
        var check = {
          'one': 1,
          'two': 2,
          'three': 3,
          'four': 4,
          'five': 5,
        }
        let max;
        for(let key in check) {
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

  const clientRated = (mant:string, masp: string) => {
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

  useEffect(() => {
    getRatingOfProduct(medicine.masp);
    getCommentsOfProduct(medicine.masp);
    clientRated(nhathuoc.manhathuoc, medicine.masp);
  }, []);

  // const commentsData = [
  //   {
  //     comment: "comment 1",
  //   },
  //   {
  //     comment: "comment 2",
  //   },
  //   {
  //     comment: "comment 3",
  //   },
  //   {
  //     comment: "comment 4",
  //   },
  // ];

  if (medicine)
    return (
      // <SafeAreaView
      //   style={{
      //     flex: 1,
      //     backgroundColor: COLORS.white,
      //   }}
      // >
      <ScrollView>
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
          {console.log(medicine.photo)}
          {medicine.photo ? (
            <Image
              source={{ uri: medicine.photo }}

              // style={{ resizeMode: "contain", flex: 1 }}
            />
          ) : (
            <></>
          )}
        </View>
        <View>
          <Rating
            type="star"
            // ratingBackgroundColor=
            showRating={true}
            showReadOnlyText={true}
            ratingCount={5}
            imageSize={30}
            startingValue={ratings}
            readonly={true}
          />
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
                {medicine.dongia}VND
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
            // ListHeaderComponent={renderHeader()}
            contentContainerStyle={style.commentsContainer}
          />
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{}}
              onPress={() =>
                addComment(medicine, nhathuoc, "TEST COMMENT", "2021-08-19", 1)
              }
            >
              <Ionicons name="add-circle-outline" style={{ fontSize: 50 }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      // </SafeAreaView>
    );
};

// const {
//   loading: false,
//   error: false,
//   data: false,
// };

// if (productLoading) {
//   return <Loading hasBackground />;
// }

// if (productError) {
//   return <Error error={productError} />;
// }

function renderComment({ item: comment }) {
  return (
    <CommentCard
      style={style.commentCard}
      // id={comment.id}
    >
      <Text>{comment.nhathuoc.tennhathuoc}: {comment.noidung}</Text>
      <Text>Ngày: {comment.time}</Text>
    </CommentCard>
  );
}

// function renderNumberOfComments() {
//   return (
//     <Text style={styles.title}>
//       {commentsData && commentsData.comments.length > 0
//         ? `Comments [${commentsData.comments.length}]`
//         : 'No comments found'}
//     </Text>
//   );
// }

// function renderHeader() {
//   const {product} = productData;
//   return (
//     <>
//       <Product product={product} />
//       <AddComment productId={product.id} />
//       {commentsLoading && <Loading />}
//       {commentsError && <Error error={commentsError} />}
//       {renderNumberOfComments()}
//     </>
//   );
// }

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
    alignItems: "center",
    // minHeight: 120,
    height: 400,
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
    width: 80,
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
});

export default DetailProductScreen;
