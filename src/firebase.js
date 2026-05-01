import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoVw9p9EebQmeiHdnxzQ2-Y82wk_gc_Y0",
  authDomain: "instaflow-ai-d8038.firebaseapp.com",
  projectId: "instaflow-ai-d8038",
  storageBucket: "instaflow-ai-d8038.firebasestorage.app",
  messagingSenderId: "896000636829",
  appId: "1:896000636829:web:1ea56e386d4b5fa1ee2174",
  measurementId: "G-LYHD65FXBV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    uid: user.uid,
  };
};

export const logoutFirebase = () => signOut(auth);
