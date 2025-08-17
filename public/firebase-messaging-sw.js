importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCKkv7LL9tO5D0U4Cnfi3CM-OFpuyseq_M",
  authDomain: "nextjs-core.firebaseapp.com",
  projectId: "nextjs-core",
  storageBucket: "nextjs-core.appspot.com",
  messagingSenderId: "905897922179",
  appId: "1:905897922179:web:b075e0fe50ba8bbafa15b6",
  measurementId: "G-ZDEHHJF4SZ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
