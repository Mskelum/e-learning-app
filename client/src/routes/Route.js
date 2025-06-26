import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import Dashboard from "../adminScreens/Dashboard";
import Home from "../userScreens/Home";
import Splash from "../components/Splash";
import Login from "../auth/Login";
import Register from "../auth/Register";
import EnrolledCourses from "../userScreens/Enrolled";
import CourseDetails from "../userScreens/CourseDetails";
import EditCourse from "../components/editCourse";
import AddCourse from "../components/addCourse";
import About from "../adminScreens/About";
import Contact from "../userScreens/Contact";
import ChatScreen from "../chatbot/Chatbot";
import MyCourses from "../adminScreens/MyCourses";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#333",
      tabBarStyle: { backgroundColor: "#000" },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="dashboard" color={color} size={size} />,
        title: "Dashboard",
      }}
    />
    <Tab.Screen
      name="About"
      component={About}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        title: "About",
      }}
    />

  </Tab.Navigator>
);

// User Tab Navigator
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#333",
      tabBarStyle: { backgroundColor: "#000" },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="EnrolledCourses"
      component={EnrolledCourses}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        title: "Enrollment"
      }}
    />
    <Tab.Screen
      name="Contact"
      component={Contact}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        title: "Contact"
      }}
    />

  </Tab.Navigator>

);

const AppHome = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="CourseDetails" component={CourseDetails} options={{ headerShown: false }} />
        <Stack.Screen name="EditCourse" component={EditCourse} options={{ headerShown: false }} />
        <Stack.Screen name="AddCourse" component={AddCourse} options={{ headerShown: false }} />
        <Stack.Screen name="Chatbot" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyCourses" component={MyCourses} options={{ headerShown: false }} />
        <Stack.Screen
          name="UserTabs"
          component={UserTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminTabs"
          component={AdminTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppHome;
