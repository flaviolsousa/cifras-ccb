import React, { useEffect, useState, useRef } from "react";
import { Platform, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Constants from "expo-constants";

// Key for storing the last visited hymn details
const LAST_HYMN_KEY = "@dev_navigation_last_hymn";
// Flag to prevent navigation loop on first load
const NAVIGATION_HANDLED_KEY = "@dev_navigation_handled";

// Detect if we're in development environment
const isDevelopment = () => {
  if (process.env.NODE_ENV === "development") return true;

  // For Expo
  return Constants.appOwnership === "expo";
};

// Helper function to find HymnDetails screen in nested navigation states
const findHymnDetailsRoute = (route: any): any => {
  // Check if current route is HymnDetails
  if (route.name === "HymnDetails") {
    return route;
  }

  // Check for nested state
  if (route.state?.routes) {
    for (const childRoute of route.state.routes) {
      const found = findHymnDetailsRoute(childRoute);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

const DevNavigationHelper: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentRouteName, setCurrentRouteName] = useState<string | null>(null);
  const [currentRouteParams, setCurrentRouteParams] = useState<any>(null);
  const [isInitialNavigationDone, setIsInitialNavigationDone] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);
  const navigationCompleted = useRef(false);
  const navigationAttempts = useRef(0);
  const preventNavigationBack = useRef(false);
  const lastHymnDetailsTimestamp = useRef(0);

  // Mark app as initialized after a short delay
  useEffect(() => {
    if (isDevelopment()) {
      const timer = setTimeout(() => {
        setAppInitialized(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Set up listeners for navigation state changes
  useEffect(() => {
    if (!isDevelopment() || !navigation) return;

    // Block back navigation if we just restored a hymn
    const blockBackHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (preventNavigationBack.current) {
        return true; // Prevents default back behavior
      }
      return false;
    });

    // Add listener for navigation state changes
    const unsubscribeFocus = navigation.addListener("state", (e: any) => {
      try {
        if (!e.data?.state) return;

        // Look through all routes in the state to find HymnDetails
        const routes = e.data.state.routes;
        if (!routes || !routes.length) return;

        for (const route of routes) {
          const hymnDetailsRoute = findHymnDetailsRoute(route);
          if (hymnDetailsRoute) {
            setCurrentRouteName(hymnDetailsRoute.name);
            setCurrentRouteParams(hymnDetailsRoute.params);

            // Save last time we were on HymnDetails
            lastHymnDetailsTimestamp.current = Date.now();

            // Save state if we have the necessary parameters
            if (hymnDetailsRoute.params?.hymnCode && hymnDetailsRoute.params?.hymnsCode) {
              saveNavigationState(hymnDetailsRoute.params);
            }

            break;
          }
        }
      } catch (error) {
        console.error("DevNavigationHelper: 6 Error processing navigation state:", error);
      }
    });

    return () => {
      unsubscribeFocus();
      blockBackHandler.remove();
    };
  }, [navigation]);

  // Save navigation state when in HymnDetails
  const saveNavigationState = async (params: any) => {
    try {
      if (params?.hymnCode && params?.hymnsCode) {
        const keyValue = JSON.stringify({
          hymnCode: params.hymnCode,
          hymnsCode: params.hymnsCode,
          timestamp: Date.now(),
        });
        await AsyncStorage.setItem(LAST_HYMN_KEY, keyValue);
      }
    } catch (error) {
      console.error("DevNavigationHelper: 8 Error saving navigation state:", error);
    }
  };

  // Detect if we're navigating away from HymnDetails unintentionally
  useEffect(() => {
    if (!isDevelopment() || !navigation || !navigationCompleted.current) return;

    let navigationWatchdog: NodeJS.Timeout | null = null;

    if (lastHymnDetailsTimestamp.current > 0) {
      navigationWatchdog = setTimeout(() => {
        // If it's been less than 500ms since we navigated to HymnDetails
        // and we're no longer there, we need to navigate back
        const timeSinceNavigation = Date.now() - lastHymnDetailsTimestamp.current;
        if (timeSinceNavigation < 500 && navigationCompleted.current) {
          restoreLastNavigation();
        }
      }, 300);
    }

    return () => {
      if (navigationWatchdog) {
        clearTimeout(navigationWatchdog);
      }
    };
  }, [currentRouteName]);

  // Helper function to restore the last navigation
  const restoreLastNavigation = async () => {
    try {
      const savedStateJSON = await AsyncStorage.getItem(LAST_HYMN_KEY);

      if (!savedStateJSON) return;

      const savedState = JSON.parse(savedStateJSON);
      if (!savedState.hymnCode || !savedState.hymnsCode) return;

      // Use CommonActions to reset and navigate
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: "Home" },
            {
              name: "HymnDetails",
              params: {
                hymnCode: savedState.hymnCode,
                hymnsCode: savedState.hymnsCode,
              },
            },
          ],
        }),
      );

      preventNavigationBack.current = true;
      setTimeout(() => {
        preventNavigationBack.current = false;
      }, 1000);
    } catch (error) {
      console.error("DevNavigationHelper: Error restoring navigation:", error);
    }
  };

  // Check for saved state on mount and restore if needed
  useEffect(() => {
    if (!isDevelopment() || !navigation || isInitialNavigationDone || !appInitialized) return;

    // Clear navigation completed flag on load
    navigationCompleted.current = false;

    const restoreNavigation = async () => {
      try {
        // Clean up previous handled flag first to ensure we can navigate
        await AsyncStorage.removeItem(NAVIGATION_HANDLED_KEY);

        const savedStateJSON = await AsyncStorage.getItem(LAST_HYMN_KEY);

        if (!savedStateJSON) {
          return;
        }

        const savedState = JSON.parse(savedStateJSON);

        // Only restore if saved within the last minute (to avoid old states)
        const isRecent = Date.now() - savedState.timestamp < 60 * 60 * 1000; // last hour
        if (!isRecent) {
          return;
        }

        // Mark as handled to prevent loop
        setIsInitialNavigationDone(true);
        navigationAttempts.current += 1;

        // Use reset to make sure we're at the right place in the navigation stack

        // Wait for any initial navigation to complete
        setTimeout(() => {
          // Use CommonActions to reset and navigate
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: "Home" },
                {
                  name: "HymnDetails",
                  params: {
                    hymnCode: savedState.hymnCode,
                    hymnsCode: savedState.hymnsCode,
                  },
                },
              ],
            }),
          );

          // Set flags to prevent navigating away
          preventNavigationBack.current = true;

          setTimeout(() => {
            navigationCompleted.current = true;

            // Keep the back prevention for a bit longer
            setTimeout(() => {
              preventNavigationBack.current = false;
            }, 1000);
          }, 500);
        }, 3500);
      } catch (error) {
        console.error("DevNavigationHelper: 11 Error restoring navigation:", error);
      }
    };

    if (navigationAttempts.current < 2) {
      restoreNavigation();
    } else {
    }
  }, [navigation, isInitialNavigationDone, appInitialized]);

  // This component doesn't render anything
  return null;
};

export default DevNavigationHelper;
