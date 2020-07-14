/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var idioma;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        StatusBar.hide();

        // Guardamos el dato de estado de pruebas en el local storage
        localStorage.setItem("pruebas", "false");
        // Guardamos el dato de si estamos o no en modo debug
        localStorage.setItem("debugMode", "false");

        //localStorage.clear();
        
        //Sólo si no estamos en pruebas (pruebas a false), se carga el sistema de notificaciones push de onesignal        
        if(localStorage.getItem("pruebas") == "false"){

            // Add to index.js or the first page that loads with your app.
            // For Intel XDK and please add this to your app.js.
        
            //Remove this method to stop OneSignal Debugging 
            window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
        
            var notificationOpenedCallback = function(jsonData) {
                //console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                //alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));

                //Si estamos logueados comprueba el tipo de usuario que se trata 
                // y si es voluntario o beneficiario en el click de la notificación recarga los datos correspondientes
                if( localStorage.getItem("foodieToken") != "" 
                    && localStorage.getItem("foodieToken") != null
                    && localStorage.getItem("foodieToken") != undefined
                    && localStorage.getItem("userType") != ""
                    && localStorage.getItem("userType") != null
                    && localStorage.getItem("userType") != undefined
                ){
                    foodieApp.takeUserTo(localStorage.getItem("userType"));
                }

            };

            // Set your iOS Settings
            var iosSettings = {};
            iosSettings["kOSSettingsKeyAutoPrompt"] = false;
            iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
        
            window.plugins.OneSignal
            .startInit("28a9ac3b-4e25-46bc-8ae9-5e95ff0b7cad")
            .handleNotificationOpened(notificationOpenedCallback)
            .iOSSettings(iosSettings)
            .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
            .endInit();

            window.plugins.OneSignal.getIds(function(ids) {
                //Se guardan el userid y el pushToken en el local storage
                localStorage.setItem("userId", ids.userId);
                localStorage.setItem("pushToken", ids.pushToken);
                //alert("player id: " + ids.userId);
            });
        
            // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
            window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
            console.log("User accepted notifications: " + accepted);
            });

        }

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        //BLOQUEAMOS LA ORIENTECIÓN A PORTRAIT
        screen.orientation.lock('portrait');
        //console.log('Orientation is ' + screen.orientation.type );

        //SE OBTIENE EL IDIOMA
        navigator.globalization.getPreferredLanguage(
            function(language){
                //alert('language: ' + language.value + '\n');
                idioma = language.value;
                foodieApp.cargaTraducciones();
            },
            function(){
                alert('Error getting language\n');
            }
        );

        setTimeout(() => {
            //Se hacen inicializaciones
            foodieApp.inicializa();
            //Colocamos los elementos de las pantallas
            foodieApp.colocaPantallas();

        }, 100);
        

    }
};
