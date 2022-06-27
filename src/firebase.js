import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore , collection, addDoc} from "firebase/firestore"
import { GoogleAuthProvider, signInWithPopup,
    FacebookAuthProvider,createUserWithEmailAndPassword,
    signInWithEmailAndPassword,signOut,getAuth,GithubAuthProvider
} from 'firebase/auth';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAmeVNxGFJCe4nWo7zDNNa4GePbQyA93tw",
    authDomain: "upcycling-project-ex.firebaseapp.com",
    databaseURL: "https://upcycling-project-ex-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "upcycling-project-ex",
    storageBucket: "upcycling-project-ex.appspot.com",
    messagingSenderId: "763504697046",
    appId: "1:763504697046:web:7eab09dda319dcba2b3377"
};
// Initialize Firebase 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

//회원가입 
const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,email,password);
        const user = userCredential.user;
        await addDoc(collection(firestore, "users"), {
            uid: user.uid,
            email: user.email,
        });
        return true
    } catch(error) {
        return {error: error.code}
    }
};
//로그인
const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        return true
    } catch (error) {
        return {error: error.message}
    }
};
//구글로그인
const gprovider = new GoogleAuthProvider();
    gprovider.setCustomParameters({'display': 'popup'});
    const signInWithGoogle = () => signInWithPopup(auth, gprovider);

//페이스북 로그인
const fprovider = new FacebookAuthProvider();
    fprovider.setCustomParameters({'display': 'popup'});
    const signInWithFacebook = () => signInWithPopup(auth, fprovider);

//github 로그인
const gitprovider = new GithubAuthProvider();
    gitprovider.setCustomParameters({'display': 'popup'});
    const signInWithGithub = () => signInWithPopup(auth, gitprovider);


const SignOut = async() => {
    try {
        await signOut(auth)
        return true
    } catch (error) {
        return false
    }
};

const storage = getStorage(app);

export { app , auth , db , 
    firestore ,storage, signIn , signUp, SignOut,
    signInWithGoogle, signInWithFacebook ,signInWithGithub};
