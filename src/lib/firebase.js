// Import the functions you need from the SDKs you need

import {
  initializeApp,
  getAnalytics,
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  collection,
  getFirestore,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from './firebase.util.js';


// import profile from '../pages/profile.js';

// // console.log('profile', profile.template);


const firebaseConfig = {
  apiKey: 'AIzaSyDIRrQ_iwja7mfLbiFMCFyAzdhDcgcsoRI',
  authDomain: 'paws-sn.firebaseapp.com',
  projectId: 'paws-sn',
  storageBucket: 'paws-sn.appspot.com',
  messagingSenderId: '311934905620',
  appId: '1:311934905620:web:621715c4a0e60821c06601',
  measurementId: 'G-LCLLP4CTSC',
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();

// registrarse con cualquier correo
export const signInEmail = (email, password, name) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      console.log(user);
      sendEmailVerification(auth.currentUser).then(() => {
        alert('Hemos enviado a tu correo electrónico el enlace de confirmación');
      });
      window.location.hash = 'login';
    })
    .catch((error) => {
      const errorCode = error.code;
      alert('Correo ya registrado, por favor intente con otro correo.');
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);

      // ..
    });
};

// registrarse o iniciar sesión con google

export const signInGoogle = () => {
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  console.log(auth);
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.hash = 'post';
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
};
// Iniciar sesión

export const logInEmail = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('user', user);
      // nameU.innerHTML = auth;
      console.log('AUTHsignin', auth.currentUser);

      // ...
      // window.location.hash = 'post';
      if (user.emailVerified) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.hash = 'post';
      } else {
        alert('Para iniciar sesión debes confirmar el link que enviamos a tu correo electrónico');
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      alert('Usario y/o contraseña inválido');
      const errorMessage = error.message;
    });
};

export const savePost = (postDescription) => addDoc(collection(db, 'post'), { postDescription });
// console.log('probando', collection(db, 'post'));
export const getPost = () => getDocs(collection(db, 'post'));
export const onGetPost = (callback) => onSnapshot(collection(db, 'post'), callback);
export const deletePost = (id) => deleteDoc(doc(db, 'post', id));