import firebase from "firebase/app"
import "firebase/messaging"

const config = {
  apiKey: "AIzaSyAJMBLvlmYgnaUg38aqIlGqp2lYzI9Pu2A",
  authDomain: "opvizor-e934b.firebaseapp.com",
  projectId: "opvizor-e934b",
  storageBucket: "opvizor-e934b.appspot.com",
  messagingSenderId: "1042886348676",
  appId: "1:1042886348676:web:c9005ff94278b8447257d1",
  measurementId: "G-RWQH4N3RG8"
}

if (!firebase.initializeApp.length) {
  firebase.initializeApp(config)
}

export const messaging = firebase.messaging()

const firebaseNotifications = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      const token = await messaging.getToken({
        vapidKey:
          "BJBPDFmrQ-znyGCn0LAZ3AUnfCutwqwUE7g0E3wtgK-nHixv6hGku_QR60o3yldgpKTqgcu9HVhx3fONq8JTWSA"
      })
      return token
    }
  } catch (error) {
    console.log(error)
  }
}

export default firebaseNotifications
