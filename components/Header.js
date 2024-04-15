import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import React from "react";
  
  const Header = () => {
    return (
      <View style={{ marginBottom: 5 }}>
        <ImageBackground
          style={{ height: 70, resizeMode: "contain" }}
          source={{
            uri: "",
          }}
        >
          <Pressable
            style={{
              height: 50,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 5,
              width: "90%",
              top: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                
                <Text
                  style={{ marginVertical: 5, fontSize: 16, fontWeight: "700" }}
                >
                  Now showing
                </Text>
                <Text style={{ fontSize: 15, color: "gray", fontWeight: "500" }}>
                 
                </Text>
              </View>
              
            </View>
          </Pressable>
        </ImageBackground>
      </View>
    );
  };
  
  export default Header;
  
  const styles = StyleSheet.create({});
  