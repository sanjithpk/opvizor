importScripts("https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js")

const config = {
  apiKey: "AIzaSyAJMBLvlmYgnaUg38aqIlGqp2lYzI9Pu2A",
  authDomain: "opvizor-e934b.firebaseapp.com",
  projectId: "opvizor-e934b",
  storageBucket: "opvizor-e934b.appspot.com",
  messagingSenderId: "1042886348676",
  appId: "1:1042886348676:web:c9005ff94278b8447257d1",
  measurementId: "G-RWQH4N3RG8"
}

firebase.initializeApp(config)

const messaging = firebase.messaging()
