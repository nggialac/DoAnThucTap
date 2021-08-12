import React from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import COLORS from "../../../assets/colors/Colors";
import { CommentCard } from "./CommentCard";

const DetailProductScreen = ({ navigation, route }) => {
  const plant = route.params;

  const commentsData = [
    {
      comment: "comment 1",
    },
    {
      comment: "comment 2",
    },
    {
      comment: "comment 3",
    },
    {
      comment: "comment 4",
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
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
          <Image
            source={plant.image}
            style={{ resizeMode: "contain", flex: 1 }}
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
            <View style={style.line} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Best choice
            </Text>
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
              {plant.name}
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
                ${plant.price}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>About</Text>
            <Text
              style={{
                color: "grey",
                fontSize: 16,
                lineHeight: 22,
                marginTop: 10,
              }}
            >
              {plant.about}
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
                <View style={style.borderBtn}>
                  <Text style={style.borderBtnText}>-</Text>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    marginHorizontal: 10,
                    fontWeight: "bold",
                  }}
                >
                  1
                </Text>
                <View style={style.borderBtn}>
                  <Text style={style.borderBtnText}>+</Text>
                </View>
              </View>

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
            </View>
          </View>
        </View>

        {/* COMMENTS */}
        <View style={{paddingHorizontal: 10}}>
          <Text style={[style.headerText, {marginTop: 30}]}>Comments</Text>
          <FlatList
            data={commentsData ? commentsData : []}
            renderItem={renderComment}
            // ListHeaderComponent={renderHeader()}
            contentContainerStyle={style.commentsContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
      <Text>{comment.comment}</Text>
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
