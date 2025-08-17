import Config from "@app/config";
import {getAnalytics} from "firebase/analytics";
import {initializeApp} from "firebase/app";
import {getPerformance} from "firebase/performance";

// import {getMessaging, getToken, onMessage} from "firebase/messaging";

if (typeof window !== "undefined") {
  const app = initializeApp(Config.FIREBASE);
  getAnalytics(app);
  getPerformance(app);
  // Get token for notification
  // const messaging = getMessaging(app);
  // getToken(messaging)
  //   .then((token) => console.log(token))
  //   .catch((e) => console.error(e));
  // onMessage(messaging, (payload) => {
  //   console.log("Message received. ", payload);
  // });
}
