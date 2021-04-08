import firebase from 'firebase/app';
import 'firebase/auth';
// import * as firebase from 'firebase'
// import { EntryPlugin } from 'webpack';
var firebaseConfig = {
    apiKey: "AIzaSyCJzRG6pv3SytbQ-LXRf5Fq0WERc8XtHQc",
    authDomain: "filmoteka-2b38e.firebaseapp.com",
    projectId: "filmoteka-2b38e",
    storageBucket: "filmoteka-2b38e.appspot.com",
    messagingSenderId: "224865246962",
    appId: "1:224865246962:web:79af745d84133cc8e63a6b",
    measurementId: "G-0MWEBTBFTX"
};
  console.log(firebase);
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const refs = {
    txtEmail: document.querySelector('#txtEmail'),
    txtPassword: document.querySelector('#txtPassword'),
    btnLogin: document.querySelector('#btnLogin'),
    btnSignUp: document.querySelector('#btnSignUp'),
    btnLogout: document.querySelector('#btnLogout'),
}
console.log(refs.txtEmail);

refs.btnLogin.addEventListener('click', e => {
    const email = refs.txtEmail.value;
    const pass = refs.txtPassword.value;
    const auth = firebase.default.auth();
    console.log(auth);

//sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e))
 
})

    //sign up
refs.btnSignUp.addEventListener('click', e => {
    const email = refs.txtEmail.value;
    const pass = refs.txtPassword.value;
    const auth = firebase.default.auth();
    console.log(auth);

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        // .then(user =>console.log(user))
        .catch(e => console.log(e))
});

    
    refs.btnLogout.addEventListener('click', e => {
        firebase.default.auth().signOut()
        // refs.btnLogout.classList.add('hide');
    })

    //add a real time listener

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            refs.btnLogout.classList.remove('hide');
        } else {
            console.log('not logged in');
            refs.btnLogout.classList.add('hide');
        }
    })