// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCGiDTZn-uEO7TFm9OStiF_wopboWtc3Mc",
    authDomain: "imagesearch-bf5cd.firebaseapp.com",
    databaseURL: "https://imagesearch-bf5cd-default-rtdb.firebaseio.com/",
    projectId: "imagesearch-bf5cd",
    storageBucket: "imagesearch-bf5cd.appspot.com",
    messagingSenderId: "625574836945",
    appId: "1:625574836945:web:45f845e2d805008458a3f0",
    measurementId: "G-N2P0TZFNQ6"
  };

// Initialize Firebase
let app = firebase.initializeApp(firebaseConfig);
firebase.analytics();


let checkUser = (username, password) => {
    firebase.database()
        .ref('usuarios')
        .orderByChild('username')
        .equalTo(username)
        .once('value', function (snapshot) {
            checkPassword(snapshot, username, password)
            checkSession();
        });
}

let checkPassword = (snapshot, user, password) => {
    sessionStorage.user = false;
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().password == password) {
            sessionStorage.user = true;
            return;
        }else{
            $('#error-contrasena').show();
        }
    });

    if(!snapshot.val()){
        // create a register for user
        createUser(user, password);
    }
};

let createUser = (user, password) => {
    var rootRef = firebase.database().ref('usuarios')
    var newStoreRef = rootRef.push()
    newStoreRef.set({
            username: user,
            password: password
        })
    sessionStorage.user = true;
    checkSession(true)
    return;
}

let getStats = () => {
    firebase.database()
        .ref('calificaciones')
        .on('value', function (snapshot) {
            $("#cantidad").html(snapshot.val().cantidad);
            $("#calificacion").html((snapshot.val().acumulado / snapshot.val().calificaciones).toFixed(2));
        });
}

let updateStats = (busquedas, calificacion, calificacionValor) => {
    firebase.database()
        .ref('calificaciones/cantidad')
        .transaction(function(cantidad) {
            // If node/clicks has never been set, currentRank will be `null`.
            return (cantidad || 0) + busquedas;
          });
    firebase.database()
        .ref('calificaciones/calificaciones')
        .transaction(function(cantidad) {
            // If node/clicks has never been set, currentRank will be `null`.
            return (cantidad || 0) + calificacion;
          });
    firebase.database()
        .ref('calificaciones/acumulado')
        .transaction(function(acumulado) {
            // If node/clicks has never been set, currentRank will be `null`.
            return (acumulado || 0) + calificacionValor;
          });
}

let checkSession = (newUser) => {
    if (sessionStorage.user == "true"){
        $(".wrap").hide()
    }else{
        $(".wrap").show()
    }
    if(newUser){
        $('#welcome').show();
    }
}

$(document).ready(function() {
    getStats();
    checkSession();
});


