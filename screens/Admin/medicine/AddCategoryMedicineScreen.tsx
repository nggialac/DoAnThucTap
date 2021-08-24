import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";

import { useTheme } from "react-native-paper";
import { Formik } from "formik";
import { getLastCategoryMedicine, postCategoryMedicine } from "../../../api/MedicineApis";
import Navigation from "../../../navigation";


const AddMedicineScreen = ({navigation, route}) => {

  const { colors } = useTheme();
  const [last, setLast] = useState("");

  const addCategoryMedicine = (params:object) => {
    postCategoryMedicine(params)
    .then(res=>{
      console.log(res);
      Alert.alert("", "Success!", [
        { text: "ok" },
      ]);
      navigation.goBack();
    })
    .catch(e=>{
      // Alert.alert("Submit Failed", e+"", [
      //   { text: "ok" },
      // ]);
      Alert.alert("Submit Failed", JSON.stringify(params), [
        { text: "ok" },
      ]);
      console.log(JSON.stringify(params));
    })
  } 

  const getLastDanhMuc = () =>{
    getLastCategoryMedicine()
    .then(res=>{
      console.log(res.data)
      // setLast(res.data);

      let temp = res.data.madm.slice(2,6);
      console.log(temp);
      let temp1 = parseInt(temp);
      temp1++;
      console.log(temp1);
      var str = "" + temp1;
      while (str.length < 4) {
        str = "0" + str;
      }
      // console.log("DM"+str);
      setLast("DM"+str);
      
    })
    .catch(e=>{
      Alert.alert("Failed", "Cannot get data!", [
        { text: "ok" },
      ]);
    })
  }

  useEffect(()=>{
    getLastDanhMuc();
  }, [])

  // function pad(last: any, length: number) {
  //   let temp = last.madm.slice(2,6);
  //   // console.log(temp);
  //   temp = parseInt(temp) + 1;
  //   var str = "" + temp;
  //   while (str.length < length) {
  //     str = "0" + temp;
  //   }
  //   console.log("DM"+temp);
  //   return "DM"+temp;
  // }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          madm: "",
          tendm: "",
        }}
        onSubmit={async (values) => {
          const errors = {};
          if (
            // values.madm ||
            !values.tendm
          ) {
            errors.madm = "Required";
            errors.tendm = "Required";
            Alert.alert("Submit Failed", "Please insert required data!", [
              { text: "ok" },
            ]);
          } else {
            addCategoryMedicine({
                madm: last,
                tendm: values.tendm
            })
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View style={{marginTop: 50}}>
            <Text style={styles.title}>Medicine Category</Text>
            <View style={styles.action}>
              {/* <Feather name="phone" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Mã danh mục"
                placeholderTextColor="#666666"
                keyboardType="default"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.disabled,
                    // backgroundColor: colors.disabled
                  },
                ]}
                // onChangeText={handleChange("madm")}
                // value={values.madm}
                value={last ? last : ""}
                editable={false}
              />
            </View>

            <View style={styles.action}>
              {/* <Feather name="phone" color={colors.text} size={20} /> */}
              <TextInput
                placeholder="Tên danh mục"
                placeholderTextColor="#666666"
                keyboardType="default"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                onChangeText={handleChange("tendm")}
                value={values.tendm}
              />
            </View>

            <TouchableOpacity
              style={styles.commandButton}
              onPress={handleSubmit}
            >
              <Text style={styles.panelButtonTitle}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddMedicineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 50
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#6c06cc",
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
    marginBottom: 20,
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
  }
});
