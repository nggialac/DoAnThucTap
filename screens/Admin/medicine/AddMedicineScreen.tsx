import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  LogBox,
  ScrollView,
} from "react-native";

import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
// import  firebase  from "../../../assets/firebase/FirebaseConfig";
import firebase from "firebase";
import {
  getLastMedicine,
  getListCategoryMedicine,
  postMedicine,
} from "../../../api/MedicineApis";
import { color } from "react-native-reanimated";
// import { color } from "react-native-reanimated";
import uuid from "react-native-uuid";
// import firebaseConfig from "../../../assets/firebase/FirebaseConfig"

LogBox.ignoreAllLogs();

const firebaseConfig = {
  apiKey: "AIzaSyCB7cILNrc15QrwrSfHAQz9_AL1uZYBeDw",
  authDomain: "medical-ecom-72c30.firebaseapp.com",
  projectId: "medical-ecom-72c30",
  storageBucket: "medical-ecom-72c30.appspot.com",
  messagingSenderId: "658730150454",
  appId: "1:658730150454:web:56fc511a1fba36877fc697",
  measurementId: "G-WPXBLYCEKF",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AddMedicineScreen = ({ route }) => {
  // console.log(route.params);
  // const [dm, setDm] = useState([route.params]);
  const [image, setImage] = useState();
  const danhmuc = route.params.danhmuc;
  console.log(danhmuc);
  const { colors } = useTheme();
  const [msp, setMsp] = useState("");

  React.useEffect(() => {
    getLastMedicine()
      .then((res) => {
      let temp = res.data.masp.slice(2,10);
      console.log(temp);
      let temp1 = parseInt(temp);
      temp1++;
      console.log(temp1);
      var str = "" + temp1;
      while (str.length < 8) {
        str = "0" + str;
      }
      console.log("DM"+str);
      setMsp("DM"+str);
        // setMsp(res.data.masp);
      })
      .catch((e) => {
        Alert.alert("Fail", "Not found Data!", [{ text: "ok" }]);
      });
  }, []);

  const pickImage = async () => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [3, 4],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (
    uri: string,
    name: string,
    firebasePath: string
  ) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = firebase.storage().ref(`${firebasePath}/${name}`);
    await imageRef.put(blob, { contentType: "image/jpg" }).catch((error) => {
      throw error;
    });
    const url = await imageRef.getDownloadURL().catch((error) => {
      throw error;
    });
    return url;
  };

  const addMedicine = (params: object) => {
    postMedicine(params)
      .then((res) => {
        console.log(res);
        Alert.alert("Success", "Submit complete!", [{ text: "ok" }]);
      })
      .catch((e) => {
        // Alert.alert("Submit Failed", e+"", [
        //   { text: "ok" },
        // ]);
        Alert.alert("Failed", "Submit Failed", [{ text: "ok" }]);
        console.log(JSON.stringify(params));
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{ backgroundColor: colors.background }}
          >
            <ImageBackground
              source={{
                uri: image,
              }}
              style={{ height: 100, width: 120 }}
              imageStyle={{ borderRadius: 15 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      <Formik
        initialValues={{
          // masp: "",
          dongia: "",
          // khuyenmai: "",
          mota_chitiet: "",
          mota_ngan: "",
          soluong: "",
          tensp: "",
        }}
        onSubmit={async (values) => {
          const errors = {};
          if (
            // !values.masp ||
            !values.dongia ||
            // !values.khuyenmai ||
            !values.mota_chitiet ||
            !values.mota_ngan ||
            !values.soluong ||
            !values.tensp ||
            !image ||
            !msp ||
            (parseInt(values.dongia) < 1000 ||
            parseInt(values.dongia) > 1000000000) ||
            (parseInt(values.soluong) < 0 || parseInt(values.soluong) > 1000000)
            // danhmuc
          ) {
            // errors.masp = "Required";
            errors.dongia = "Required";
            // errors.khuyenmai = "Required";
            errors.mota_ngan = "Required";
            errors.mota_chitiet = "Required";
            errors.soluong = "Required";
            errors.tensp = "Required";
            Alert.alert("Submit Failed", "Please insert valid data!", [
              { text: "ok" },
            ]);
          } else {
            //Upload image
            // await uploadImage(image, values.masp, "/ProductImages/")
            await uploadImage(image, uuid.v4(), "/ProductImages/")
              .then((res) => {
                values.photo = res;
              })
              .catch((e) => {
                Alert.alert("Submit Failed", e, [{ text: "ok" }]);
              });
            // //

            addMedicine({
              danhmuc: {
                madm: danhmuc.madm,
                tendm: danhmuc.tendm,
              },
              dongia: parseInt(values.dongia),
              // khuyenmai: parseFloat(values.khuyenmai),
              // khuyenmai: 0,
              masp: msp,
              mota_chitiet: values.mota_chitiet,
              mota_ngan: values.mota_ngan,
              photo: values.photo,
              soluong: parseInt(values.soluong),
              tensp: values.tensp,
            });
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Mã danh mục"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                // onChangeText={handleChange("masp")}
                value={danhmuc.tendm}
                editable={false}
              />
            </View>
            <View style={styles.action}>
              <TextInput
                placeholder="Mã SP"
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: colors.disabled,
                  },
                ]}
                // onChangeText={handleChange("masp")}
                editable={false}
                value={msp}
              />
            </View>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Tên SP"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("tensp")}
                value={values.tensp}
              />
            </View>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Mô tả ngắn"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("mota_ngan")}
                value={values.mota_ngan}
              />
            </View>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Mô tả chi tiết"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("mota_chitiet")}
                value={values.mota_chitiet}
              />
            </View>
            {/* <View style={styles.action}> */}
              {/* <Feather name="phone" color={colors.text} size={20} /> */}
              {/* <TextInput
                placeholder="Số lượng"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("soluong")}
                value={values.soluong}
              />
            </View> */}
            <View style={styles.action}>
              {/* <Feather name="phone" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Đơn giá (VND)"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("dongia")}
                value={values.dongia}
              />
            </View>
            {/* <View style={styles.action}>
              <TextInput
                placeholder="Khuyến mãi"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("khuyenmai")}
                value={values.khuyenmai}
              />
            </View> */}
            <TouchableOpacity
              style={styles.commandButton}
              onPress={handleSubmit}
            >
              <Text style={styles.panelButtonTitle}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default AddMedicineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#694fad",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  picker: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
  },
});
