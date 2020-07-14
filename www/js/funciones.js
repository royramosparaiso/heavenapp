
// ///////////////////////////
//  ESTADOS DE UN SERVICIO  //
// ///////////////////////////
/*
    1 - Esperando beneficiario -> Quiere decir que se ha creado la donación y está esperando que el beneficiario acepte
    2 - Esperando voluntario -> Quiere decir que algún beneficiario ha pedido algo y esperamos al voluntario 
    3 - Aceptó voluntario -> Voluntario ha aceptado el servicio y tiene que ir a recoger la donación
    4 - Recogió donación -> Voluntario recogió la donación y ahora va a llevarla
    5 - Entrega y foto -> El voluntario ha llegado al beneficiario y ha hecho la entrega y confirmaenviando la foto (ESTADO FINAL)
    6 - cancelado -> El servicio se ha cancelado a las 01AM porque nadie ha hecho un cambio de estado.
*/

// ////////////
//  EVENTOS  //
// ////////////


/* ----------- */
/* WINDOW LOAD */
/* ----------- */
$(window).on('load', () => {});


/* -------------- */
/* DOCUMENT READY */
/* -------------- */
$(document).ready(() => {

    //Inicializamos el swiper, que es el slider vertical
    foodieApp.initSwiper();

    //Eventos para el touch en las listas
    /*
    $(document).on("touchstart","ul.listado li",function(){
        $(this).addClass("pulsado");
    }); 
  
    $(document).on("touchend","ul.listado li",function(){
        $(this).removeClass("pulsado");
    });
    */

    // ----------------------------------------------------------------------------
    // Tras comprobar la conexión
    // se muestra el logo, se espeara un tiempo. Se comprueba si se está logueado
    // Se sabe si se está logueado si la variable foodieToken está vacía. foodieToken contiene el token que nos manda el servidor para saber que se está logueado
    // La variable del localstorage userType nos indicará el tipo de usuario del que se trasta
    // Tanto foodieToken como userType se guardan en el local storage al loguearse
    // Si ya se está logueado, se comprueba que esté activo y se mira el tipo de usuario que es y se le lleva a la pantalla correspondiente
    // Si no está logueado, se le lleva a la pantalla de logiun
    // ----------------------------------------------------------------------------
    setTimeout(()=>{

        if(foodieApp.checkConnection() == "none"){
            alert("No tiene conexión a Internet. Compruebe su configuración");
        }
        else{

            //Si no estamos logueados, lleva al login
            if( 
                localStorage.getItem("foodieToken") == ""
                || localStorage.getItem("foodieToken") == null
                || localStorage.getItem("foodieToken") == undefined
                || localStorage.getItem("userType") == ""
                || localStorage.getItem("userType") == null
                || localStorage.getItem("userType") == undefined
            ){
                foodieApp.swiper.slideTo(1,400); //se manda al slide 1 que es el slide del login
            }
            else{
    
                if(localStorage.getItem("debugMode") == "true"){
                    /*
                    alert("ya estás logueado");
                    alert(
                        "VALORES GUARDADOS DEL USUARIO LOGUEADO"+"\n"
                        +"-------------------------------------"+"\n\n"
                        +"idUsuario: "+localStorage.getItem("idUsuario")+"\n"
                        +"email: "+localStorage.getItem("email")+"\n"
                        +"nombre: "+localStorage.getItem("nombre")+"\n"
                        +"apellidos: "+localStorage.getItem("apellidos")+"\n"
                        +"nombreUsuario: "+localStorage.getItem("nombreUsuario")+"\n"
                        +"foodieToken: "+localStorage.getItem("foodieToken")+"\n"
                        +"userType: "+localStorage.getItem("userType")+"\n"
                    );
                    */
                }
    
                // Si estamos logueados, comprueba que el usuario no esté desactivado. 
                // Si no está desactivado nos lleva a la pantalla correspondiente en función del tipo de usuario
                // Si está deactivado,desloguea al usuario, lleva al login y muestra aviso de que el usuario no está logueado
    
                $(".velo").addClass("visible");
       
                $.ajax({
                    type: 'GET',
                    headers: {
                        'x-auth-token': localStorage.getItem("foodieToken")
                    },
                    url: foodieApp.baseUrlApi+"login",
                    cache: false,
                    crossDomain: true,
                    success: function(result,status,xhr){
        
                        $(".velo").removeClass("visible");
    
                        // Si el usuario está activo se lleva a la pantalla que le corresponde
                        if(result.data.active == "1"){

                            foodieApp.takeUserTo(localStorage.getItem("userType"));

                        }
                        // Si el usuario está deactivado se le desloguea, se lleva a pantalla de login y se muestra error
                        else if(result.data.active == "0"){
                            
                            foodieApp.logOff();
                            foodieApp.swiper.slideTo(1,400);
                            foodieApp.muestraAviso(foodieApp.traducciones.errors.errorUserInactive,"danger",4000);
    
                        }
    
                        
        
                        if(localStorage.getItem("debugMode") == "true"){
        
                            console.log("*************************");
                            console.log("*************************");
                            console.log(mydump(result));
                            console.log(mydump(status));
                            console.log(mydump(xhr));
                            console.log("*************************");
                            console.log("*************************");
        
                            alert("*************************\n"
                            +"VALORES DEL RESULT"+"\n"
                            +"-----------------"+"\n"
                            +mydump(result)+"\n"
                            +"VALORES DEL STATUS"+"\n"
                            +"-----------------"+"\n"
                            +mydump(status)+"\n"
                            +"VALORES DEL XHR"+"\n"
                            +"-----------------"+"\n"
                            +mydump(xhr)+"\n"
                            +"*************************");
        
                        }
        
                    },
                    error: function(xhr,status,error){
        
                        $(".velo").removeClass("visible");
        
                        if(localStorage.getItem("debugMode") == "true"){
        
                            console.log("*************************");
                            console.log("*************************");
                            console.log(mydump(xhr));
                            console.log(mydump(status));
                            console.log(mydump(error));
                            console.log("*************************");
                            console.log("*************************");
        
                            alert("*************************\n"
                            +"VALORES DEL XHR "+"\n"
                            +"-----------------"+"\n"
                            +mydump(xhr)+"\n"
                            +"VALORES DEL STATUS"+"\n"
                            +"-----------------"+"\n"
                            +mydump(status)+"\n"
                            +"VALORES DEL ERROR"+"\n"
                            +"-----------------"+"\n"
                            +mydump(error)+"\n"
                            +"*************************");
                        }
        
    
                        foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
    
        
                    }
        
                });
        
            }

        }

    },6000);


    
    // ----------------------------------------------------------------------------
    // Eventos de ajax
    // ----------------------------------------------------------------------------
    
    // Cuando se inicie un ajax se muestra el velo con el spinner
    $(document).ajaxStart(function(){
        //$(".velo").addClass("visible");
    });

    // Cuando se termine un ajax se oculta el velo con el spinner
    $(document).ajaxStop(function(){
        //$(".velo").removeClass("visible");
    });


    // ----------------------------------------------------------------------------
    // Click del botón de volver
    // ----------------------------------------------------------------------------
    document.addEventListener("backbutton", ()=>{

        switch(foodieApp.swiper.activeIndex){
            case 0:
                navigator.app.exitApp();
                break;
            case 1:
                navigator.app.exitApp();
                break;
            case 2:
                navigator.app.exitApp();
                break;
            case 3:
                foodieApp.swiper.slideTo(2,0);
                break;
           case 4:
                if(foodieApp.showingDeatailVolunt){
                    foodieApp.showingDeatailVolunt = false;
                    foodieApp.doVolunt();
                }
                else{
                    navigator.app.exitApp();
                }
                break;
           case 5:
                navigator.app.exitApp();
                break;
           case 6:
                navigator.app.exitApp();
                break;
           case 7:
                navigator.app.exitApp();
                break;
           case 8:
                navigator.app.exitApp();
                break;
           case 9:
                if(foodieApp.showingDeatailBenef){
                    foodieApp.showingDeatailBenef = false;
                    foodieApp.doBenef();
                }
                else{
                    navigator.app.exitApp();
                }
                break;
           case 10:
                foodieApp.swiper.slideTo(0,0);
                break;
        }

    }, false);

    // ----------------------------------------------------------------------------
    // Click en el botón de Volver ( Flecha )
    // ----------------------------------------------------------------------------
    $("i.volver").on("click",function(){
        if($(this).data("tipo") == "voluntario"){
            if(foodieApp.showingDeatailVolunt){
                foodieApp.showingDeatailVolunt = false;
                foodieApp.doVolunt();
            }
            else{
                navigator.app.exitApp();
            }
        }
        else if($(this).data("tipo") == "beneficiario"){
            if(foodieApp.showingDeatailBenef){
                foodieApp.showingDeatailBenef = false;
                foodieApp.doBenef();
            }
            else{
                navigator.app.exitApp();
            }
        }
    });

    // ----------------------------------------------------------------------------
    // Click en la flecha de refrescar
    // ----------------------------------------------------------------------------
    $("i.refrescar").on("click",function(){
        if($(this).data("tipo") == "voluntario"){
            foodieApp.doVolunt();
        }
        else if($(this).data("tipo") == "beneficiario"){
            foodieApp.doBenef();
        }
    });

    // ----------------------------------------------------------------------------
    // Click en el icono de desloguearse
    // ----------------------------------------------------------------------------
    $("i.desconectar").on("click",function(){
        foodieApp.logOff();
    });

    // ----------------------------------------------------------------------------
    // EVENTOS EN EL FORMULARIO DE LOGIN
    // EL BOTON DE ACCEDER APARECE DESHABILITADO HAS TA QUE SE RELLENAN LOS CAMPOS
    // ----------------------------------------------------------------------------
    $("#InputUser1").on("keyup",function(){
        //Si ambos campos están rellenos, activa el botón de Acceder
        if( 
            $(this).val() != ""  
            && $(this).val() != null 
            && $(this).val() != undefined 
            && $(this).val().length >= 5 
            && $("#InputPassword").val() != ""
            && $("#InputPassword").val() != null
            && $("#InputPassword").val() != undefined
            && $("#InputPassword").val().length >= 5
        ){
            $("#login button").prop("disabled", false); 
        }
        //Si los campos no están rellenos, inactiva el botón de acceder
        else{
            $("#login button").prop("disabled", true); 
        }
    });

    $("#InputPassword").on("keyup",function(){
        //Si ambos campos están rellenos, activa el botón de Acceder
        if( 
            $(this).val() != ""  
            && $(this).val() != null 
            && $(this).val() != undefined 
            && $(this).val().length >= 5 
            && $("#InputUser1").val() != ""
            && $("#InputUser1").val() != null
            && $("#InputUser1").val() != undefined
            && $("#InputUser1").val().length >= 5
        ){
            $("#login button").prop("disabled", false); 
        }
        //Si los campos no están rellenos, inactiva el botón de acceder
        else{
            $("#login button").prop("disabled", true); 
        }
    });

    // ----------------------------------------------------------------------------
    // Click en el check de mostrar la contraseña en el login
    // ----------------------------------------------------------------------------
    $(".form-check input").change(function(){
        if(this.checked){
            $("input#InputPassword").attr("type","text");
        }
        else{
            $("input#InputPassword").attr("type","password");
        }
    });

    // ----------------------------------------------------------------------------
    // Click del botón de login
    // Al hacer login se conecta al servidor (Enviamos usuario,password,userId,pushToken y plataforma), si devuelve error se muestra mensaje de error
    // Si se loguea obtiene los datos correspondientes. Guarda eln el localstorage entre otros valores el foodieToken (El token de estar logueado) y el userType (Nos sirve para saber el tipo de usuario que es)
    // Al loguearse en función del tipo de usuario manda a donde corresponda
    // ----------------------------------------------------------------------------
    $("#login button").on("click",function(){

        $(".velo").addClass("visible");

        var oneSignalUserId = "";
        var oneSignalPushToken = "";
        /*
        if(localStorage.getItem("pruebas")=="true"){
            var platform = "Android";
        }
        else{
            var platform = device.platform;
        }
        */

       var platform = device.platform;

        //Si los valores dentro del localstorage del userid y del pushtoken van rellenos, los mandamos.
        if( localStorage.getItem("userId") != null && localStorage.getItem("userId") != undefined && localStorage.getItem("userId") != "" ){
            oneSignalUserId = localStorage.getItem("userId");
            oneSignalPushToken = localStorage.getItem("pushToken");
        }

        if(localStorage.getItem("debugMode") == "true"){
            alert(
                "VALORES QUE SE ESTÁN PASANDO AL SERVIDOR"+"\n"
                +"-------------------------------------"+"\n\n"
                +"username: "+$("#InputUser1").val()+"\n"
                +"password: "+$("#InputPassword").val()+"\n"
                +"oneSignalUserId: "+oneSignalUserId+"\n"
                +"oneSignalPushToken: "+oneSignalPushToken+"\n"
                +"platform: "+platform+"\n"
            );
        }


        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token',
                'x-auth-token':  ''
            },
            url: foodieApp.baseUrlApi+"login",
            data: JSON.stringify({
                username: $("#InputUser1").val(),
                password: $("#InputPassword").val(),
                oneSignalUserId: oneSignalUserId,
                oneSignalPushToken: oneSignalPushToken,
                platform: platform
            }),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function(result,status,xhr){

                // Cuando se produce el success, obtenemos los datos y los guardamos en el local storage para saber que el usuario está logueado
                // Estos datos sólo se guardan si el usuario logueado es de tipo distinto a admin
                // Los datos que vamos a guardar en el local storage al hacer login son:
                // idUsuario, email, nombre, apellidos, nombreUsuario, foodieToken (token para conectarse al servidor), userType 
                // Después de guardarse los datos se accede a la sección correspondiente a su tipo
                if(result.data.rol[0]=="ROLE_ADMIN"){
                    //Si el usuario que se loguea tiene el rol de administrador no se le deja loguearse
                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorUserPassword,"danger",4000);
                    //Vaciamos las cajas de usuario y de password
                    $("#InputUser1").val("");
                    $("#InputPassword").val("");
                    $("#login button").prop("disabled", true);
                }
                else{
                    localStorage.setItem("idUsuario", result.data.id);
                    localStorage.setItem("email", result.data.email);
                    localStorage.setItem("nombre", result.data.name);
                    localStorage.setItem("apellidos", result.data.surname);
                    localStorage.setItem("nombreUsuario", result.data.username);
                    localStorage.setItem("foodieToken", result.data.apiToken);
                    localStorage.setItem("userType", result.data.rol[0]);

                    foodieApp.takeUserTo(result.data.rol[0]);
                    
                }

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    alert(
                        "VALORES GUARDADOS EN EL LOCALSTORAGE TRAS LOGUEARSE"+"\n"
                        +"-------------------------------------"+"\n\n"
                        +"idUsuario: "+localStorage.getItem("idUsuario")+"\n"
                        +"email: "+localStorage.getItem("email")+"\n"
                        +"nombre: "+localStorage.getItem("nombre")+"\n"
                        +"apellidos: "+localStorage.getItem("apellidos")+"\n"
                        +"nombreUsuario: "+localStorage.getItem("nombreUsuario")+"\n"
                        +"foodieToken: "+localStorage.getItem("foodieToken")+"\n"
                        +"userType: "+localStorage.getItem("userType")+"\n"
                    );

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");

                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                // Si nos devuelve un 401 (Unauthorized) es porque no se han puesto bien el usuario o el password 
                // En este caso se muestra un aviso diciendo que están mal el usuario o el password
                // En el resto de los casos mostramos un error genérico
                if(error == "Unauthorized"){
                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorUserPassword,"danger",4000);
                    //Vaciamos las cajas de usuario y de password
                    $("#InputUser1").val("");
                    $("#InputPassword").val("");
                    $("#login button").prop("disabled", true);
                    $(".form-check input").prop("checked", false);
                    $("input#InputPassword").attr("type","password");                    
                }
                else{
                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
                }

            }

        });

    });

    // ----------------------------------------------------------------------------
    // Click del botón de selección de producto
    // ----------------------------------------------------------------------------
    $("#donacion .seleccion .elemento").on("click",function(){

        $("#donacion .seleccion .elemento").each(function(){
            $(this).removeClass("seleccionado");
        });
        $(this).addClass("seleccionado");

        foodieApp.codProducto = $(this).data("codigo");

    });

    // ----------------------------------------------------------------------------
    // Click del botón de enviar donación
    // ----------------------------------------------------------------------------
    $("#donacion button").on("click",function(){

        // Si no se ha seleccionado el producto o la caja de cantidad viene vacía muestra notificación de error
        if(foodieApp.codProducto == 0 || $("#donacion .cantidad input").val() == "" || $("#donacion .cantidad input").val() == null || $("#donacion .cantidad input").val() == undefined ){
            foodieApp.muestraAviso(foodieApp.traducciones.errors.errorServingFood,"danger",4000);
        }        
        // si todo viene relleno correctamente, se envía la donación}
        else{

            if(localStorage.getItem("debugMode") == "true"){
                console.log("*************************");
                console.log("*************************");
                console.log("PRODUCTO Y CANTIDAD");
                console.log(foodieApp.codProducto);
                console.log($("#donacion .cantidad input").val());
                console.log("*************************");
                console.log("*************************");
    
                alert("*************************\n"
                +"PRODUCTO Y CANTIDAD "+"\n"
                +"-----------------"+"\n"
                +mydump(foodieApp.codProducto)+"\n"
                +mydump($("#donacion .cantidad input").val())+"\n"
                +"*************************");
            }

            $(".velo").addClass("visible");

            //Hacemos la llamada a la api para establecer el producto y la cantidad a donar
            $.ajax({
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'my-auth-token',
                    'x-auth-token': localStorage.getItem("foodieToken")
                },
                url: foodieApp.baseUrlApi+"donacion",
                data: JSON.stringify({
                    cantidad: $("#donacion .cantidad input").val(),
                    producto: foodieApp.codProducto
                }),
                cache: false,
                contentType: "application/json",
                dataType: "json",
                crossDomain: true,
                success: function(result,status,xhr){

                    // Si hay éxito se lleva a la página correspondiente
                    $(".velo").removeClass("visible");
                    foodieApp.swiper.slideTo(3,0);

                    // Se desmarcan las selecciones
                    $("#donacion .seleccion .elemento").each(function(){
                        $(this).removeClass("seleccionado");
                    });
                    foodieApp.codProducto = 0;

                    // Se vacía la caja de cantidad
                    $("#donacion .cantidad input").val("");

                    if(localStorage.getItem("debugMode") == "true"){
                        console.log("*************************");
                        console.log("*************************");
                        console.log(mydump(result));
                        console.log(mydump(status));
                        console.log(mydump(xhr));
                        console.log("*************************");
                        console.log("*************************");

                        alert("*************************\n"
                        +"VALORES DEL RESULT"+"\n"
                        +"-----------------"+"\n"
                        +mydump(result)+"\n"
                        +"VALORES DEL STATUS"+"\n"
                        +"-----------------"+"\n"
                        +mydump(status)+"\n"
                        +"VALORES DEL XHR"+"\n"
                        +"-----------------"+"\n"
                        +mydump(xhr)+"\n"
                        +"*************************");
                    }

                },
                error: function(xhr,status,error){

                    // Si hay error se muestra notificación de error
                    $(".velo").removeClass("visible");
                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
    
                    if(localStorage.getItem("debugMode") == "true"){
    
                        console.log("*************************");
                        console.log("*************************");
                        console.log(mydump(xhr));
                        console.log(mydump(status));
                        console.log(mydump(error));
                        console.log("*************************");
                        console.log("*************************");
    
                        alert("*************************\n"
                        +"VALORES DEL XHR "+"\n"
                        +"-----------------"+"\n"
                        +mydump(xhr)+"\n"
                        +"VALORES DEL STATUS"+"\n"
                        +"-----------------"+"\n"
                        +mydump(status)+"\n"
                        +"VALORES DEL ERROR"+"\n"
                        +"-----------------"+"\n"
                        +mydump(error)+"\n"
                        +"*************************");
                    }

                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

                }    
            });


        }
        
      
    });


    // ----------------------------------------------------------------------------
    // Click del botón de pantalla de confirmación del donación del proveedor
    // Se vuelve a la pantalla de donación del proveedor
    // ----------------------------------------------------------------------------
    $("#exitoDonacion button").on("click",function(){
        //si se está logueado debería llevar a la pantalla de donación
        foodieApp.swiper.slideTo(2,0);
        //$(".velo").addClass("visible");
        //si no se está logueado debería llevar al login
    });


    // ----------------------------------------------------------------------------
    // Click en los elementos del listado servicios de donaciones mostrado al voluntario en caso de que haya más de uno
    // ----------------------------------------------------------------------------
    $(document).on("click","#confirmVoluntario1 ul.listado li",function(){
        $(this).addClass("pulsado");
        setTimeout(() => {
            $(this).removeClass("pulsado");
        }, 250);
        setTimeout(() => {
            foodieApp.showingDeatailVolunt = true;
            foodieApp.showDetailVolunt($(this).data("id"));
        }, 150);

    });


    // ----------------------------------------------------------------------------
    // Click del botón de confirmación del voluntario
    // ----------------------------------------------------------------------------
    $("#confirmVoluntario1 button").on("click",function(){

        $(".velo").addClass("visible");

        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token',
                'x-auth-token':  localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"servicio",
            data: JSON.stringify({
                servicio_id: foodieApp.servSelecVolunt[0].servicioId,
                donacion_id: foodieApp.servSelecVolunt[0].donacionId,
                voluntario_id: localStorage.getItem("idUsuario")
            }),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function(result,status,xhr){

                $(".velo").removeClass("visible");

                //Ocultamos la flecha de volver
                $("#confirmVoluntario1 i.volver").addClass("noDisplay");
                foodieApp.showingDeatailVolunt = false;

                // Si el result.status es error es porque alguien ha confirmado ya el servicio
                // y mostarmos aviso de que alguien ya lo ha hecho
                if(result.status == "error"){

                    foodieApp.muestraAviso(result.message,"danger",4000);
                    foodieApp.doVolunt();

                }
                // En caso de que result.status sea success
                // Lleva a la pantalla de confirmación de la recogida
                else if(result.status == "success"){

                    // Pintamos la dirección y el teléfono del proveedor
                    $("#confirmVoluntario2 .datos").empty();
                    $("#confirmVoluntario2 .datos").append("<p class=\"direccion\">"+foodieApp.servSelecVolunt[0].proveedorDireccion+". "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorProvincia.toLowerCase())+", "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorMunicipio.toLowerCase())+".</p>");
                    $("#confirmVoluntario2 .datos").append("<a onclick=\"window.open('tel:"+foodieApp.servSelecVolunt[0].proveedorTelefono+"')\" class=\"external telefono\">"+foodieApp.servSelecVolunt[0].proveedorTelefono+"</a>");

                    // Se manda a la pantalla de confirmación de recogida
                    foodieApp.swiper.slideTo(5,0);
                }

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");
                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });

    });

    // ----------------------------------------------------------------------------
    // Click del botón de confirmar recogida de la pantalla de confirmación de recogida
    // ----------------------------------------------------------------------------
    $("#confirmVoluntario2 button.confirmar").on("click",function(){

        $(".velo").addClass("visible");

        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token',
                'x-auth-token':  localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"servicio",
            data: JSON.stringify({
                servicio_id: foodieApp.servSelecVolunt[0].servicioId,
                donacion_id: foodieApp.servSelecVolunt[0].donacionId,
                voluntario_id: localStorage.getItem("idUsuario")
            }),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function(result,status,xhr){

                $(".velo").removeClass("visible");

                // Si se prodice un error se muestra el mensaje
                if(result.status == "error"){
                    foodieApp.muestraAviso(result.message,"danger",4000);
                }
                // En caso de que result.status sea success
                // Lleva a la pantalla de confirmación de la entrega
                else if(result.status == "success"){

                    // Pintamos la dirección y el teléfono del beneficiario
                    $("#confirmVoluntario3 .datos").empty();
                    $("#confirmVoluntario3 .datos").append("<p class=\"direccion\">"+foodieApp.servSelecVolunt[0].beneficiarioDireccion+". "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioProvincia.toLowerCase())+", "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioMunicipio.toLowerCase())+".</p>");
                    $("#confirmVoluntario3 .datos").append("<a onclick=\"window.open('tel:"+foodieApp.servSelecVolunt[0].beneficiarioTelefono+"')\" class=\"external telefono\">"+foodieApp.servSelecVolunt[0].beneficiarioTelefono+"</a>");
                    
                    // Se manda a la pantalla de confirmación de entrega
                    foodieApp.swiper.slideTo(6,0);
                    
                }

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");
                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });

    });

    // ----------------------------------------------------------------------------
    // Click del botón de cancelar de la pantalla de confirmación de recogida
    // ----------------------------------------------------------------------------
    $("#confirmVoluntario2 button.cancelar").on("click",function(){

        $(".velo").addClass("visible");

        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token',
                'x-auth-token':  localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"servicio/cancel",
            data: JSON.stringify({
                servicio_id: foodieApp.servSelecVolunt[0].servicioId
            }),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function(result,status,xhr){

                $(".velo").removeClass("visible");

                // Si hay éxito en la canceclación vuelve a la pantalla de confirmación de la donación por el voluntario
                foodieApp.swiper.slideTo(4,0);
                //Se ejecutan las acciones necesarias a la página de aceptación del voluntario
                foodieApp.doVolunt();

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");
                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });


    });


    // ----------------------------------------------------------------------------
    // Click del botón de confirmación de la entrega de la donación
    // ----------------------------------------------------------------------------
    $("#confirmVoluntario3 button.confirmar").on("click",function(){
            foodieApp.swiper.slideTo(7,0);
            // Se muestra el paso 1 de la pantalla de tomar el selfie
            $("#confirmVoluntario4 .paso1").removeClass("noDisplay");
            $("#confirmVoluntario4 .paso2").addClass("noDisplay");
    });

    // ----------------------------------------------------------------------------
    // Click en el botón de tomar selfie
    // ----------------------------------------------------------------------------
    $('#confirmVoluntario4 button.tomaSelfie').on('click', function(){
        foodieApp.activarCamara();
    });

    // ----------------------------------------------------------------------------
    // Click en el botón de enviar selfie
    // ----------------------------------------------------------------------------
    $('#confirmVoluntario4 button.enviaSelfie').on('click', function(){
        
        $(".velo").addClass("visible");

        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token',
                'x-auth-token':  localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"servicio",
            data: JSON.stringify({
                servicio_id: foodieApp.servSelecVolunt[0].servicioId,
                donacion_id: foodieApp.servSelecVolunt[0].donacionId,
                voluntario_id: localStorage.getItem("idUsuario"),
                foto: foodieApp.deliveryPicture
            }),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function(result,status,xhr){

                $(".velo").removeClass("visible");

                // Si se prodice un error se muestra el mensaje
                if(result.status == "error"){
                    foodieApp.muestraAviso(result.message,"danger",4000);
                }
                // En caso de que result.status sea success
                // Lleva a la pantalla que informa que se ha terminado el proceso
                else if(result.status == "success"){
                    foodieApp.swiper.slideTo(8,0);

                    // Se muestra el paso 1 de la pantalla de tomar el selfie
                    $("#confirmVoluntario4 .paso1").removeClass("noDisplay");
                    $("#confirmVoluntario4 .paso2").addClass("noDisplay");

                    // Se vacía la propiedad de la foto
                    foodieApp.deliveryPicture = "";
                }

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");
                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });

    });

    // ----------------------------------------------------------------------------
    // Evento del input file para subir el selfie
    // ----------------------------------------------------------------------------
    /*
    $('#confirmVoluntario4').on('change', function(){ 
        //uploadFile(); 
        
        $(".velo").addClass("visible");
        setTimeout(()=>{
            $(".velo").removeClass("visible");
            foodieApp.swiper.slideTo(8,0);
        },5000);

    });
    */

    // ----------------------------------------------------------------------------
    // Click del botón de terminar la entrega de la donación
    // ----------------------------------------------------------------------------
    $("#confirmVoluntario5 button").on("click",function(){
            
        // Se muestra el paso 1 de la pantalla de tomar el selfie
        $("#confirmVoluntario4 .paso1").removeClass("noDisplay");
        $("#confirmVoluntario4 .paso2").addClass("noDisplay");

        // Llevamos a la pantalla inicial del voluntarios
        foodieApp.swiper.slideTo(4,0);
        foodieApp.doVolunt();
    });


    // ----------------------------------------------------------------------------
    // Click en los elementos del listado servicios de donaciones mostrado al beneficiario en caso de que haya más de uno
    // ----------------------------------------------------------------------------
    $(document).on("click","#aceptBeneficiario ul.listado li",function(){
        $(this).addClass("pulsado");
        setTimeout(() => {
            $(this).removeClass("pulsado");
        }, 250);
        setTimeout(() => {
            foodieApp.showingDeatailBenef = true;
            foodieApp.showDetailBenef($(this).data("id"));
        }, 150);

    });

    // ----------------------------------------------------------------------------
    // Click del botón de aceptación del beneficiario
    // ----------------------------------------------------------------------------
    $("#aceptBeneficiario button").on("click",function(){

        // Cantidad que ha solicitado el beneficiario en la caja de cantidad
        // Si la caja de cnatidad viene vacía,se muestra un aviso y la cantidad solicitada se queda a null
        // Si la caja viene con contenido, la cantidad solicitada es la cantidad que se puso en la caja de cnatidad
        var cantidadSolicitada = null;
        if($("#aceptBeneficiario .cantidad input").val() == "" || $("#aceptBeneficiario .cantidad input").val() == null || $("#aceptBeneficiario .cantidad input").val() == undefined){
            //cantidadSolicitada = foodieApp.servSelecBenef[0].disponible;
            foodieApp.muestraAviso(foodieApp.traducciones.errors.errorSetQuantity,"danger",4000);
        }
        else{
            cantidadSolicitada = $("#aceptBeneficiario .cantidad input").val();
        }

        // Cantidad final que se envará en la petición
        var cantidadEnviar = null;

        // Si la cantidad solicitada es null o es menor o iguala 0 o es mayor a la cantidad disponible, la cantidad a enviar se queda a null
        // y muestra una notificación diciendo que no se puede realizar la petición
        if(cantidadSolicitada == null || cantidadSolicitada <= 0 || cantidadSolicitada > foodieApp.servSelecBenef[0].disponible){
            //cantidadEnviar = foodieApp.servSelecBenef[0].disponible;
            foodieApp.muestraAviso(foodieApp.traducciones.errors.errorWrongQuantity,"danger",4000);
        }
        // Si la cantidad solicitada está entre 0 y la cantidad disponible la cantidad a enviar es la cantidad solicitada
        // Y se envía la solicitud
        else if(cantidadSolicitada > 0 && cantidadSolicitada <= foodieApp.servSelecBenef[0].disponible){
            
            cantidadEnviar = Math.ceil(cantidadSolicitada);

            if(localStorage.getItem("debugMode") == "true"){
                alert(mydump(foodieApp.servSelecBenef));

                alert(foodieApp.servSelecBenef[0].id);
                alert(localStorage.getItem("idUsuario"));
                alert(cantidadEnviar);
            }

            $(".velo").addClass("visible");

            $.ajax({
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'my-auth-token',
                    'x-auth-token': localStorage.getItem("foodieToken")
                },
                url: foodieApp.baseUrlApi+"servicio",
                data: JSON.stringify({
                    donacion_id: foodieApp.servSelecBenef[0].id,
                    beneficiario_id: localStorage.getItem("idUsuario"),
                    cantidad: cantidadEnviar
                }),
                cache: false,
                contentType: "application/json",
                dataType: "json",
                crossDomain: true,
                success: function(result,status,xhr){
    
                    $(".velo").removeClass("visible");

                    // Si se prodice un error se muestra el mensaje
                    if(result.status == "error"){
                        foodieApp.muestraAviso(result.message,"danger",4000);
                        foodieApp.doBenef();
                    }
                    // En caso de que result.status sea success
                    // Lleva a la pantalla de confirmación de la entrega
                    else if(result.status == "success"){
                                            
                        foodieApp.swiper.slideTo(10,0);
                    }
        
                    if(localStorage.getItem("debugMode") == "true"){
    
                        console.log("*************************");
                        console.log("*************************");
                        console.log(mydump(result));
                        console.log(mydump(status));
                        console.log(mydump(xhr));
                        console.log("*************************");
                        console.log("*************************");
    
                        alert("*************************\n"
                        +"VALORES DEL RESULT"+"\n"
                        +"-----------------"+"\n"
                        +mydump(result)+"\n"
                        +"VALORES DEL STATUS"+"\n"
                        +"-----------------"+"\n"
                        +mydump(status)+"\n"
                        +"VALORES DEL XHR"+"\n"
                        +"-----------------"+"\n"
                        +mydump(xhr)+"\n"
                        +"*************************");
    
                    }
    
                },
                error: function(xhr,status,error){
    
                    $(".velo").removeClass("visible");
    
                    if(localStorage.getItem("debugMode") == "true"){
    
                        console.log("*************************");
                        console.log("*************************");
                        console.log(mydump(xhr));
                        console.log(mydump(status));
                        console.log(mydump(error));
                        console.log("*************************");
                        console.log("*************************");
    
                        alert("*************************\n"
                        +"VALORES DEL XHR "+"\n"
                        +"-----------------"+"\n"
                        +mydump(xhr)+"\n"
                        +"VALORES DEL STATUS"+"\n"
                        +"-----------------"+"\n"
                        +mydump(status)+"\n"
                        +"VALORES DEL ERROR"+"\n"
                        +"-----------------"+"\n"
                        +mydump(error)+"\n"
                        +"*************************");
                    }
    
                    foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
    
                }
    
            });

        }

    });

    // ----------------------------------------------------------------------------
    // Click del botón de terminar en éxito de confirmación del beneficiario
    // ----------------------------------------------------------------------------
    $("#exitoConfirmBeneficiario button.terminar").on("click",()=>{
        //Ocultamos la flecha de volver
        $("#aceptBeneficiario i.volver").addClass("noDisplay");
        foodieApp.showingDeatailBenef = false;

        foodieApp.swiper.slideTo(9,0);
        foodieApp.doBenef();
    });

    // ----------------------------------------------------------------------------
    // Click del botón de refrescar en éxito de confirmación del beneficiario
    // ----------------------------------------------------------------------------
    $("#exitoConfirmBeneficiario button.refrescar").on("click",()=>{
        //Ocultamos la flecha de volver
        $("#aceptBeneficiario i.volver").addClass("noDisplay");
        foodieApp.showingDeatailBenef = false;

        foodieApp.takeUserTo(localStorage.getItem("userType"));

    });



});


/* -------------- */
/* ON SCROLL */
/* -------------- */
$(document).scroll((evento) => {
});


/* -------------- */
/*   ON RESIZE    */
/* -------------- */
//Evento on resize
$(window).on('resize', () => {
});




// //////////////////////////
//  PROPIEDADES Y MÉTODOS  //
// //////////////////////////

var foodieApp = {
    //propiedad que guarda la ruta a la api
    baseUrlApi: "http://foodieangels-prewebs7.hps.es:9099/api/",
    //propiedad que guarda el swiper
    swiper:null,
    //propiedad que indica si se está mostrando el aviso
    mostrandoAviso: false,
    //propiedad que guarda las traducciones
    traducciones: null,
    //Propiedad que guarda el código del producto a donar: 1 -> Carne, 2 -> Pescado, 3 -> Fruta, 4 ->  Verdura
    codProducto: 0,
    //Propiedad que guarda la ista de donaciones y sus servicios para el voluntario
    listVolunt: [],
    // Servicio seleccionado por el voluntario
    servSelecVolunt: [],
    //Propiedad que indica si en pantalla de voluntario hemos pasado de la lista al detalle
    showingDeatailVolunt: false,
    //Propiedad que guarda la ista de donaciones y sus servicios para el beneficiario
    listBenef: [],
    // Servicio seleccionado por el beneficiario
    servSelecBenef: [],
    //Propiedad que indica si en pantalla de beneficiario hemos pasado de la lista al detalle
    showingDeatailBenef: false,
    //Propiedad que guarda la foto que se envía opara confirmar la entrega
    deliveryPicture: "",



    //----------------------------------------------------
    // Método para inicializar algunos elementos de la app
    //----------------------------------------------------
    inicializa: function(){

        // Se desmarcan las selecciones
        $("#donacion .seleccion .elemento").each(function(){
            $(this).removeClass("seleccionado");
        });
        foodieApp.codProducto = 0;

        // Se muestra el paso 1 de la pantalla de tomar el selfie
        $("#confirmVoluntario4 .paso1").removeClass("noDisplay");
        $("#confirmVoluntario4 .paso2").addClass("noDisplay");

    },


    //----------------------------------
    // Método para cargar las traducciones
    //----------------------------------
    cargaTraducciones: function(){

        var archivo = "es.json";
        
        if(idioma.includes("es-")){
            archivo = "es.json";
        }
        else if(idioma.includes("en-")){
            archivo = "en.json";
        }

        $.getJSON("translations/app/"+archivo, function(json) {
            foodieApp.traducciones = json;
            foodieApp.aplicaTraducciones();
        });

    },


    //----------------------------------
    // Método para pintar las traducciones en la app
    // EN LA PLANTILLA EN EL SITIO DE CADA TRADUCCIÓN SE HA PUESTO ENTRE CMENTARIOS EL NOMBRE DE LA TRADUCCIÓN QUE SE USA
    // NO HAY INTERPOLACIÓN, SIMPLEMENTE SE PONE PARA QUE SE SEPA LA TRADUCCIÓN QUE VA EN CADA SITIO
    //----------------------------------
    aplicaTraducciones: () => {
        
        /* LOGIN */
        $("label[for='InputUser1']").text(foodieApp.traducciones.login.user); // Usuario
        $("input#InputUser1").attr("placeholder",foodieApp.traducciones.login.userPlaceholder); // Placeholder input Usuario
        $("label[for='InputPassword']").text(foodieApp.traducciones.login.password); // Contraseña
        $("input#InputPassword").attr("placeholder",foodieApp.traducciones.login.passwordPlaceholder); // Placeholder input Contraseña
        $("label[for='Check']").text(foodieApp.traducciones.login.showPass); // Recuérdame
        $("#login button").text(foodieApp.traducciones.buttons.access); // Botón Acceder

        /* DONACIÓN */
        $("#donacion h1").text(foodieApp.traducciones.donations.title); // Título pantalla de Donación
        $("#donacion H2").text(foodieApp.traducciones.donations.subtitle); // Subtítulo pantalla de Donación
        $("#donacion .fruta img").attr("alt",foodieApp.traducciones.general.fruit); // alt fruta
        $("#donacion .fruta span").text(foodieApp.traducciones.general.fruit); // texto fruta
        $("#donacion .verdura img").attr("alt",foodieApp.traducciones.general.vegetables); // alt verdura
        $("#donacion .verdura span").text(foodieApp.traducciones.general.vegetables); // texto verdura
        $("#donacion .carne img").attr("alt",foodieApp.traducciones.general.meat); // alt carne
        $("#donacion .carne span").text(foodieApp.traducciones.general.meat); // texto carne
        $("#donacion .pescado img").attr("alt",foodieApp.traducciones.general.fish); // alt pescado
        $("#donacion .pescado span").text(foodieApp.traducciones.general.fish); // texto pescado
        $("#donacion .cantidad input").attr("placeholder",foodieApp.traducciones.general.quantity);// placeholder input de cantidad
        $("#donacion .cantidad .tit").text(foodieApp.traducciones.general.measure); // Kg
        $("#donacion button").text(foodieApp.traducciones.buttons.send); // Botón Enviar

        /* ÉXITO DONACIÓN */
        $("#exitoDonacion P").text(foodieApp.traducciones.donations.success); // Texto de la pantalla de éxito en la donación
        $("#exitoDonacion button").text(foodieApp.traducciones.buttons.back); // Botón Volver

        /* CONFIRMACIÓN DEL VOLUNTARIO PARTE 1 */
        $("#confirmVoluntario1 button").text(foodieApp.traducciones.buttons.confirm); // Botón Confirmar

        /* CONFIRMACIÓN DEL VOLUNTARIO PARTE 2 - Confirmación de la recogida */
        $("#confirmVoluntario2 P.texto").text(foodieApp.traducciones.volunteer.makePickup); // Texto de la pantalla de confirmar la recogida
        $("#confirmVoluntario2 button").text(foodieApp.traducciones.buttons.confirmPickup); // Botón Confirmar recogida
        $("#confirmVoluntario2 button.cancelar").text(foodieApp.traducciones.buttons.cancel); // Botón cancelar

        /* CONFIRMACIÓN DEL VOLUNTARIO PARTE 3 - Confirmación de la entrega */
        $("#confirmVoluntario3 P.texto").text(foodieApp.traducciones.volunteer.makeDelivery); // Texto de la pantalla de confirmación del voluntario donde se dice que puede hacer la entrega
        $("#confirmVoluntario3 button.confirmar").text(foodieApp.traducciones.buttons.confirmDelivaery); // Botón confirmar la entrega
               
        /* CONFIRMACIÓN DEL VOLUNTARIO PARTE 4 - Envío de foto de  confirmación de entrega */
        $("#confirmVoluntario4 P").text(foodieApp.traducciones.volunteer.sendSelfie); // Texto de la pantalla de confirmación del voluntario donde se dice que debe tomar el selfie
        $("#confirmVoluntario4 button.tomaSelfie").text(foodieApp.traducciones.buttons.takeSelfie); // Botón de tomar selfie
        $("#confirmVoluntario4 button.enviaSelfie").text(foodieApp.traducciones.buttons.AcceptSend); // Botón aceptar y enviar
        $("#confirmVoluntario4 .paso2 button.tomaSelfie").text(foodieApp.traducciones.buttons.retakeSelfie); // Botón repetir selfie

        /* CONFIRMACIÓN DEL VOLUNTARIO PARTE 5 - confirmación final de la entrega */
        $("#confirmVoluntario5 P").text(foodieApp.traducciones.volunteer.successDelivaery); // Texto de la pantalla de confirmación final del voluntario
        $("#confirmVoluntario5 button").text(foodieApp.traducciones.buttons.finish); // Botón Terminar

        /* ACEPTACIÓN DEL BENEFICIARIO  */
        $("#aceptBeneficiario .cantidad input").attr("placeholder",foodieApp.traducciones.general.quantity);// placeholder input de cantidad
        $("#aceptBeneficiario .cantidad .tit").text(foodieApp.traducciones.general.measure); // Kg
        $("#aceptBeneficiario button").text(foodieApp.traducciones.buttons.acceptDonation); // Botón Confirmar

        /* ÉXITO DE CONFIRMACIÓN DEL BENEFICIARIO */
        $("#exitoConfirmBeneficiario P").text(foodieApp.traducciones.beneficiary.successPetition); // Texto de la pantalla de éxito de confirmación del beneficiario
        $("#exitoConfirmBeneficiario button.refrescar").text(foodieApp.traducciones.buttons.refresh); // Botón refrescar
        $("#exitoConfirmBeneficiario button.terminar").text(foodieApp.traducciones.buttons.finish); // Botón terminar

    },

    //----------------------------------
    // Método para inicializar el Swiper
    //----------------------------------
    initSwiper: function(){
        this.swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            speed: 500,
            simulateTouch: false,
            allowTouchMove: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    },


    //-------------------------------------------------------
    // Método para colocar los elementos de algunas pantallas
    //-------------------------------------------------------
    colocaPantallas: function(){

        //Login
        //centramos todo el contenido
        var loginHeight= $("#login").height();
        var loginContentHeight= $("#login .contenido").height();
        $("#login .contenido").css({
            "top": (loginHeight-loginContentHeight)/2
        });


        //Donacion
        //se estabelce el alto de la caja con scroll y se coloca el botón
        var donacionHeight= $("#donacion").height();
        $("#donacion .contScroll").css({
            "height": donacionHeight-180
        });
        $("#donacion button").css({
            "position": "absolute",
            "left": 0,
            "top": donacionHeight-60
        });


    },


    //------------------------------
    // Método para mostrar los avisos
    //------------------------------
    muestraAviso: function(mensaje,tipo,duracion){
        var $elemento = $("#aviso");
        var colorFondo;
        if(!this.mostrandoAviso){
            this.mostrandoAviso = true;
            switch(tipo){
                case "danger":
                    colorFondo = "#F00"
                    break;
                case "success":
                    colorFondo = "#137f2a"
                    break;
                default:
                    colorFondo = "#F00"
            }
            $elemento.css({
                "background-color": colorFondo
            });
            $elemento.html(mensaje);

            setTimeout(()=>{

                $elemento.css({
                    "z-index": "100",
                    "opacity": 0.7
                });

                setTimeout(()=>{

                    $elemento.css({
                        "opacity": 0
                    });

                    setTimeout(()=>{

                        $elemento.css({
                            "z-index": "-100",
                        });

                        this.mostrandoAviso = false;

                    },700);

                },duracion);

            },100);

        }

    },

    //--------------------------------------------------------------
    // Método para poner en mayúsculas la primera letra de un string
    //--------------------------------------------------------------
    maysFirst: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    //------------------------------
    // Método para activar la cámara
    //------------------------------
    activarCamara: function(){

        navigator.camera.getPicture(this.exitoSelfie, this.errorSelfie, {
            quality: 60,
            targetWidth: 1024,
            targetHeight: 768,
            correctOrientation: true,
            sourceType: 1, //PHOTOLIBRARY: 0, CAMERA: 1, SAVEDPHOTOALBUM: 2
            encodingType: 0, //JPEG: 0,PNG: 1 
            allowEdit : false,
            saveToPhotoAlbum: false,
            mediaType: 2,//PICTURE: 0, VIDEO: 1, ALLMEDIA : 2 -> no funciona este al menos en android
            cameraDirection: 1, //BACK: 0, FRONT : 1 -> no funciona este al menos en android
            destinationType: 0, //DATA_URL: 0 -> base64, FILE_URI: 1, NATIVE_URI: 2 
        });
        
    },


    //------------------------------
    // Método para éxito al hacer la foto de confirmación
    //------------------------------
    exitoSelfie: function(imageData){

        // Se resetea la propiedad que guarda la foto de confirmación
        foodieApp.deliveryPicture = "";
        foodieApp.deliveryPicture = imageData;

        $("#confirmVoluntario4 .paso2 figure").empty();
        //$("#confirmVoluntario4 .paso2 figure").append("<img src='"+foodieApp.deliveryPicture+"' id='fotoResult'>");
        $("#confirmVoluntario4 .paso2 figure").append("<img src='data:image/jpeg;charset=utf-8;base64,"+foodieApp.deliveryPicture+"' id='fotoResult'>");

        // Se muestra el paso 2 de la pantalla de tomar el selfie
        $("#confirmVoluntario4 .paso1").addClass("noDisplay");
        $("#confirmVoluntario4 .paso2").removeClass("noDisplay");

    },


    //------------------------------
    // Método para error al hacer el selfie
    //------------------------------
    errorSelfie: function(message){
        //foodieApp.muestraAviso("Error al hacer el selfie: "+message,"danger",4000);
        //alert("Error al hacer el selfie: "+message);
    },
    
    
    //------------------------------
    // Método para comprobar la conexión
    //------------------------------
    checkConnection: function() {

        var networkState = navigator.connection.type;

        //alert(networkState);

        return networkState;

        /*
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
    
        alert('Connection type: ' + states[networkState]);
        */
    },

    //------------------------------------------------------------------------------
    // Método que lleva a la pantalla correspondiente en relación al tipo de usuario
    // Se le pasa el tipo de usuario de que se trate
    // tipo: ROLE_PROVEEDOR, ROLE_VOLUNTARIO, ROLE_BENEFICIARIO
    //------------------------------------------------------------------------------
    takeUserTo: function(tipo){

        switch(tipo){
            case "ROLE_PROVEEDOR":
                foodieApp.swiper.slideTo(2,0);
                break;
            case "ROLE_VOLUNTARIO":

                // Si el voluntario tiene asignado un servicio de una donación para entregar, 
                //se obtiene ese servicio y en función de su estado, manda a la pantalla correspondiente
                $(".velo").addClass("visible");

                $.ajax({
                    type: 'GET',
                    headers: {
                        'x-auth-token': localStorage.getItem("foodieToken")
                    },
                    url: foodieApp.baseUrlApi+"servicio/user",
                    cache: false,
                    crossDomain: true,
                    success: function(result,status,xhr){
        
                        $(".velo").removeClass("visible");

                        var idServicio = result.data.servicioId;
                        var estadoServicio = result.data.estado;

                        // Si el voluntario no tiene asignado un servicio lleva a la pantalla de selección de servicio
                        if(idServicio == "" || idServicio == null || idServicio == undefined){

                            // Pantalla de aceptación de donación del voluntario
                            foodieApp.swiper.slideTo(4,0);
                            //Se ejecutan las acciones necesarias a la página de aceptación del voluntario
                            foodieApp.doVolunt();
                            
                        }
                        // Si el voluntario tiene un servicio asignado lleva a la pantalla que corresponde
                        else{

                            //Se inicializa el servicio asignado al voluntario
                            foodieApp.servSelecVolunt = [];

                            // Creamos una versión reducida del servicio temporal a añadir en servSelecVolunt con los datos necesarios para los pasos del voluntario
                            // Se guardan todos los datos menos el horario porque en la llamada al servicio no viene
                            // Pero en los pasos posteriores a la confirmación del pedido no es necesario
                            var servicioTemporal = {
                                donacionId: result.data.donacionId,
                                servicioId: result.data.servicioId,
                                producto: result.data.producto,
                                cantidad: result.data.cantidad,
                                estado: result.data.estado,
                                proveedorId: result.data.proveedorId,
                                proveedorNombre: result.data.proveedorNombre,
                                proveedorApellidos: result.data.proveedorApellidos,
                                proveedorDireccion: result.data.direccion,
                                proveedorProvincia: result.data.proveedorProvinciaNombre,
                                proveedorMunicipio: result.data.proveedorMunicipioNombre,
                                proveedorCPostal: result.data.proveedorCPostal,
                                proveedorTelefono: result.data.proveedorTelefono,
                                proveedorEmail: result.data.proveedorEmail,
                                proveedorHorario: [],
                                beneficiarioId: result.data.beneficiarioId,
                                beneficiarioNombre: result.data.beneficiarioNombre,
                                beneficiarioApellidos: result.data.beneficiarioApellidos,
                                beneficiarioDireccion: result.data.beneficiarioDireccion,
                                beneficiarioProvincia: result.data.beneficiarioProvinciaNombre,
                                beneficiarioMunicipio: result.data.beneficiarioMunicipioNombre,
                                beneficiarioCPostal: result.data.beneficiarioCPostal,
                                beneficiarioTelefono: result.data.beneficiarioTelefono,
                                beneficiarioEmail: result.data.beneficiarioEmail
                            }

                            // Se rellena la variable correspondiente al servicio asignado
                            foodieApp.servSelecVolunt.push(servicioTemporal);

                            // El voluntario ha aceptado el servicio y debe ir a recoger el servicio
                            // Lleva a la pantalla de aceptación de la recogida
                            if(foodieApp.servSelecVolunt[0].estado == 3){

                                // Pintamos la dirección y el teléfono del proveedor
                                $("#confirmVoluntario2 .datos").empty();
                                $("#confirmVoluntario2 .datos").append("<p class=\"direccion\">"+foodieApp.servSelecVolunt[0].proveedorDireccion+". "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorProvincia.toLowerCase())+", "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorMunicipio.toLowerCase())+".</p>");
                                $("#confirmVoluntario2 .datos").append("<a onclick=\"window.open('tel:"+foodieApp.servSelecVolunt[0].proveedorTelefono+"')\" class=\"external telefono\">"+foodieApp.servSelecVolunt[0].proveedorTelefono+"</a>");

                                // Se manda a la pantalla de confirmación de recogida                            
                                foodieApp.swiper.slideTo(5,0);

                            }
                            // El voluntario ha recogido el servicio y debe realizar la entrega
                            // Lleva a la pantalla de confirmar la entrega
                            else if(foodieApp.servSelecVolunt[0].estado == 4){

                                // Pintamos la dirección y el teléfono del beneficiario
                                $("#confirmVoluntario3 .datos").empty();
                                $("#confirmVoluntario3 .datos").append("<p class=\"direccion\">"+foodieApp.servSelecVolunt[0].beneficiarioDireccion+". "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioProvincia.toLowerCase())+", "+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioMunicipio.toLowerCase())+".</p>");
                                $("#confirmVoluntario3 .datos").append("<a onclick=\"window.open('tel:"+foodieApp.servSelecVolunt[0].beneficiarioTelefono+"')\" class=\"external telefono\">"+foodieApp.servSelecVolunt[0].beneficiarioTelefono+"</a>");

                                // Se manda a la pantalla de confirmación de entrega
                                foodieApp.swiper.slideTo(6,0);

                            }
                            // El voluntario ha realizado la entrega y debe hacer la foto
                            // Lleva a la pantalla de hacer la foto
                            else if(foodieApp.servSelecVolunt[0].estado == 5){

                                foodieApp.swiper.slideTo(7,0);

                            }
                            else{
                                // Pantalla de aceptación de donación del voluntario
                                foodieApp.swiper.slideTo(4,0);
                                //Se ejecutan las acciones necesarias a la página de aceptación del voluntario
                                foodieApp.doVolunt();
                            }

                        }

                        if(localStorage.getItem("debugMode") == "true"){
        
                            console.log("*************************");
                            console.log("*************************");
                            console.log(mydump(result));
                            console.log(mydump(status));
                            console.log(mydump(xhr));
                            console.log("*************************");
                            console.log("*************************");
        
                            alert("*************************\n"
                            +"VALORES DEL RESULT"+"\n"
                            +"-----------------"+"\n"
                            +mydump(result)+"\n"
                            +"VALORES DEL STATUS"+"\n"
                            +"-----------------"+"\n"
                            +mydump(status)+"\n"
                            +"VALORES DEL XHR"+"\n"
                            +"-----------------"+"\n"
                            +mydump(xhr)+"\n"
                            +"*************************");
        
                        }
        
                    },
                    error: function(xhr,status,error){
        
                        $(".velo").removeClass("visible");
        
                        if(localStorage.getItem("debugMode") == "true"){
        
                            console.log("*************************");
                            console.log("*************************");
                            console.log(mydump(xhr));
                            console.log(mydump(status));
                            console.log(mydump(error));
                            console.log("*************************");
                            console.log("*************************");
        
                            alert("*************************\n"
                            +"VALORES DEL XHR "+"\n"
                            +"-----------------"+"\n"
                            +mydump(xhr)+"\n"
                            +"VALORES DEL STATUS"+"\n"
                            +"-----------------"+"\n"
                            +mydump(status)+"\n"
                            +"VALORES DEL ERROR"+"\n"
                            +"-----------------"+"\n"
                            +mydump(error)+"\n"
                            +"*************************");
                        }
        
    
                        foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
    
        
                    }
        
                });

                break;

            case "ROLE_BENEFICIARIO":

                // Si el beneficiario tiene asignado un servicio de una donación para recibir, 
                // se manda a la pantalla de éxito de la confirmación del beneficiario , si no lo tiene lleva a la pantalla de acpetación del beneficiario
                $(".velo").addClass("visible");

                $.ajax({
                    type: 'GET',
                    headers: {
                        'x-auth-token': localStorage.getItem("foodieToken")
                    },
                    url: foodieApp.baseUrlApi+"servicio/user",
                    cache: false,
                    crossDomain: true,
                    success: function(result,status,xhr){

                        $(".velo").removeClass("visible");

                        var idServicio = result.data.servicioId;

                        // Si el beneficiario no tiene asignado un servicio lleva a la pantalla de aceptación del beneficiario
                        if(idServicio == "" || idServicio == null || idServicio == undefined){
                            
                            // Pantalla de aceptación de aceptación del beneficiario
                            foodieApp.swiper.slideTo(9,0);
                            //Se ejecutan las acciones necesarias a la página del beneficiario
                            foodieApp.doBenef();
                            
                        }
                        // Si el voluntario tiene un servicio asignado lleva a la pantalla de éxito de la confirmación del beneficiario
                        else{

                            // Pantalla de éxito de la confirmación del beneficiario
                            foodieApp.swiper.slideTo(10,0);

                        }



                    },
                    error: function(xhr,status,error){

                        $(".velo").removeClass("visible");
        
                        if(localStorage.getItem("debugMode") == "true"){
        
                            console.log("*************************");
                            console.log("*************************");
                            console.log(mydump(xhr));
                            console.log(mydump(status));
                            console.log(mydump(error));
                            console.log("*************************");
                            console.log("*************************");
        
                            alert("*************************\n"
                            +"VALORES DEL XHR "+"\n"
                            +"-----------------"+"\n"
                            +mydump(xhr)+"\n"
                            +"VALORES DEL STATUS"+"\n"
                            +"-----------------"+"\n"
                            +mydump(status)+"\n"
                            +"VALORES DEL ERROR"+"\n"
                            +"-----------------"+"\n"
                            +mydump(error)+"\n"
                            +"*************************");
                        }
        
    
                        foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);
            
                    }
        
                });

                break;
        }

    },


    //------------------------------
    // Acciones a realizar cuando se accede a la página de aceptación del voluntario
    //------------------------------
    doVolunt: function(){

        //Inicializamos la lista
        foodieApp.listVolunt = [];

        //Se inicializa el servicio seleccionado por el voluntario
        foodieApp.servSelecVolunt = [];

        // Se oculta todo
        $("#confirmVoluntario1 ul.listado").addClass("noDisplay");
        $("#confirmVoluntario1 .detalle").addClass("noDisplay");
        
        //Ocultamos el botón
        $("#confirmVoluntario1 button").addClass("noDisplay");

        //Ocultamos los botones de volver
        $("#confirmVoluntario1 i.volver").addClass("noDisplay");

        // Establecemos el alto correcto de la zona con scroll (sin botón abajo)
        var aceptVoluntHeight= $("#confirmVoluntario1").height();
        var aceptVoluntCabeceraHeight = $("#confirmVoluntario1 .cabecera").height();

        // Se crea la variable temporal para insertar en la lista de servicios para el voluntario
        var servicioTemporal;
        
        $(".velo").addClass("visible");

        $.ajax({
            type: 'GET',
            headers: {
                'x-auth-token': localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"donacion",
            cache: false,
            crossDomain: true,
            success: function(result,status,xhr){

                // Se obtienen los datos de servicios disponibles para el usuario VOLUNTARIO
                // Si hay más de uno se muestra la lista
                // Si sólo hay uno se muestra el detalle
                // Si no hay ninguno se muestra un mensaje indicando que no hay donaciones de alimentos en la zona en ese momento

                // Se obtienen los servicios dentro de cada donación y se meten en foodieApp.listVolunt
                result.data.forEach((element)=>{

                    element.servicios.forEach((element2)=>{

                        // Servicio temporal que meteremos en el array de la lista para el voluntariofoodieApp.listVolunt
                        var servicioTemporal = {
                            donacionId: element.id,
                            servicioId: element2.servicioId,
                            producto: element.productoId,
                            cantidad: element2.cantidad,
                            estado: element2.estado,
                            proveedorId: element2.proveedorId,
                            proveedorNombre: element2.proveedorNombre,
                            proveedorApellidos: element2.proveedorApellidos,
                            proveedorDireccion: element.direccion,
                            proveedorProvincia: element2.proveedorProvinciaNombre,
                            proveedorMunicipio: element2.proveedorMunicipioNombre,
                            proveedorCPostal: element2.proveedorCPostal,
                            proveedorTelefono: element2.proveedorTelefono,
                            proveedorEmail: element2.proveedorEmail,
                            proveedorHorario: element.proveedorhorario,
                            beneficiarioId: element2.beneficiarioId,
                            beneficiarioNombre: element2.beneficiarioNombre,
                            beneficiarioApellidos: element2.beneficiarioApellidos,
                            beneficiarioDireccion: element2.beneficiarioDireccion,
                            beneficiarioProvincia: element2.beneficiarioProvinciaNombre,
                            beneficiarioMunicipio: element2.beneficiarioMunicipioNombre,
                            beneficiarioCPostal: element2.beneficiarioCPostal,
                            beneficiarioTelefono: element2.beneficiarioTelefono,
                            beneficiarioEmail: element2.beneficiarioEmail,
                        }

                        // Se añade el servicio a la lista de servicios para el voluntario
                        // siempre que esté en estado 2 que es un servicio aceptado por el beneficiario y en espera de voluntario
                        if(element2.estado == 2){
                            foodieApp.listVolunt.push(servicioTemporal);
                        }                        

                    });

                });

                var numElementos = foodieApp.listVolunt.length;

                // Si hay más de 1
                if(numElementos > 1){

                    // Se muestra título
                    //Has recibido varias peticiones de entrega de alimentos
                    $("#confirmVoluntario1 h1").text(foodieApp.traducciones.volunteer.title02);

                    // Se muestra la lista y se oculta el detalle
                    setTimeout(() => {

                        aceptVoluntCabeceraHeight = $("#confirmVoluntario1 .cabecera").height();
                        $("#confirmVoluntario1 .contScroll").css({
                            "height": aceptVoluntHeight-aceptVoluntCabeceraHeight-20
                        });

                        // Se vacía la lista
                        $("#confirmVoluntario1 ul.listado").empty();
                    
                        // Se pintan los elementos de la lsita
                        foodieApp.listVolunt.forEach((element,index) => {
                            //console.log(index+" => "+mydump(element));
                            // Rellenamos los datos antes de mostrarlo
                            var imagen;
                            var tipo;                
                            switch(element.producto){
                                case 1:
                                    imagen = "meat.png";
                                    tipo = foodieApp.traducciones.general.meat;
                                    break;
                                case 2:
                                    imagen = "fish.png";
                                    tipo = foodieApp.traducciones.general.fish;
                                    break;
                                case 3:
                                    imagen = "fruit.png";
                                    tipo = foodieApp.traducciones.general.fruit;
                                    break;
                                case 4:
                                    imagen = "vegetable.png";
                                    tipo = foodieApp.traducciones.general.vegetables;
                                    break;
                            }

                            /*
                            <li data-id="1">
                                <strong><h3><img src='img/fruta.png' style='width: 35px; height: auto; vertical-align: middle;margin-right: 7px;'> Fruta 12Kg</h3></strong>
                                <strong>Recogida: </strong> Gran vía 12 Local 1. Madrid. Madrid.<br>
                                <strong>Entrega: </strong> Hortaleza 54 1º izquierda. Madrid. Madrid.
                            </li>
                            */

                            $("#confirmVoluntario1 ul.listado").append("<li data-id='"+element.servicioId+"'><strong><h3 style='margin-bottom:15px'><img src='img/"+imagen+"' style='width: 35px; height: auto; vertical-align: middle;margin-right: 7px;'>"+tipo+" "+element.cantidad+" "+foodieApp.traducciones.general.measure+"</h3></strong><strong>"+foodieApp.traducciones.general.pickUp+": </strong>"+element.proveedorDireccion+". "+foodieApp.maysFirst(element.proveedorProvincia.toLowerCase())+", "+foodieApp.maysFirst(element.proveedorMunicipio.toLowerCase())+".<br><strong>"+foodieApp.traducciones.general.delivery+": </strong>"+element.beneficiarioDireccion+". "+foodieApp.maysFirst(element.beneficiarioProvincia.toLowerCase())+", "+foodieApp.maysFirst(element.beneficiarioMunicipio.toLowerCase())+".</li>");

                        });
                        
                        $("#confirmVoluntario1 ul.listado").removeClass("noDisplay");
                        $("#confirmVoluntario1 .detalle").addClass("noDisplay");
                        $(".velo").removeClass("visible");

                    }, 2000);
                    

                }
                // Si hay 1
                else if(numElementos == 1){
                    $(".velo").removeClass("visible");

                    // Se muestra título
                    // Has recibido una petición de entrega de alimentos
                    $("#confirmVoluntario1 h1").text(foodieApp.traducciones.volunteer.title01);

                    setTimeout(() => {
                        // Establecemos el alto correcto de la zona con scroll (sin botón abajo)
                        $("#confirmVoluntario1 .contScroll").css({
                            "height": aceptVoluntHeight-210
                        });
                        $('#confirmVoluntario1 .contScroll').scrollTop(0);
                    }, 1500);

                    // Se muestra el detalle del servicio
                    foodieApp.showDetailVolunt(foodieApp.listVolunt[0].servicioId);

                }
                // Si no hay
                else if(numElementos < 1){
                    $(".velo").removeClass("visible");
                    // Se muestra título
                    // En este momento no hay entregas en tu zona
                    $("#confirmVoluntario1 h1").text(foodieApp.traducciones.volunteer.title03);

                }

                
                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT LISTA VOLUNTARIO"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");

                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });


    },


    //------------------------------
    // Acciones a realizar cuando se quiere mostrar el detalle de un servicio en pantalla de voluntario
    //------------------------------
    showDetailVolunt: function(id){

        //Mostramos la flecha de volver si venimos de la lista
        if(foodieApp.showingDeatailVolunt){
            $("#confirmVoluntario1 i.volver").removeClass("noDisplay");
        }
        else{
            $("#confirmVoluntario1 i.volver").addClass("noDisplay");
        }

        //Se inicializa el servicio seleccionado por el voluntario
        foodieApp.servSelecVolunt = [];

        // Obtenemos el elemento del array de elementos de los servicios al voluntario
        foodieApp.servSelecVolunt = foodieApp.listVolunt.filter((el)=>{
            if(el.servicioId === id) return true;
            else return false;
        });

        //Generamos el html del horario
        var horario = "";
        horario = foodieApp.maquetaHorario(foodieApp.servSelecVolunt[0].proveedorHorario);

        // Se rellena el detalle antes de mostrarlo
        $("#confirmVoluntario1 .detalle").empty();

        var imagen;
        var tipo;                
        switch(foodieApp.servSelecVolunt[0].producto){
            case 1:
                imagen = "meat.png";
                tipo = foodieApp.traducciones.general.meat;
                break;
            case 2:
                imagen = "fish.png";
                tipo = foodieApp.traducciones.general.fish;
                break;
            case 3:
                imagen = "fruit.png";
                tipo = foodieApp.traducciones.general.fruit;
                break;
            case 4:
                imagen = "vegetable.png";
                tipo = foodieApp.traducciones.general.vegetables;
                break;
        }

        //alert(mydump(foodieApp.servSelecVolunt[0].proveedorHorario));
        var contDetalle = `
            <h2 class="producto">`+foodieApp.traducciones.general.product+`</h2>
            <ul class="datos">
            <li class="prod"><span>`+foodieApp.traducciones.general.product+`</span>: `+tipo+`</li>
            <li class="cant"><span>`+foodieApp.traducciones.general.quantity+`</span>: `+foodieApp.servSelecVolunt[0].cantidad+` `+foodieApp.traducciones.general.measure+`</li>
            </ul>

            <h2 class='proveedor'>`+foodieApp.traducciones.general.provider+`</h2>
            <ul class="datos">
                <li class='proveedor'><span>`+foodieApp.traducciones.general.provider+`</span>: `+foodieApp.servSelecVolunt[0].proveedorNombre+` `+foodieApp.servSelecVolunt[0].proveedorApellidos+`</li>
                <li class='direccion'><span>`+foodieApp.traducciones.general.adress+`</span>: `+foodieApp.servSelecVolunt[0].proveedorDireccion+`</li>
                <li class='provincia'><span>`+foodieApp.traducciones.general.province+`</span>: `+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorProvincia.toLowerCase())+`</li>
                <li class='municipio'><span>`+foodieApp.traducciones.general.town+`</span>: `+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].proveedorMunicipio.toLowerCase())+`</li>
                <li class='cpostal'><span>`+foodieApp.traducciones.general.postalCode+`</span>: `+foodieApp.servSelecVolunt[0].proveedorCPostal+`</li>
                <li class='telefono'><span>`+foodieApp.traducciones.general.telephone+`</span>: <a onclick="window.open('tel:`+foodieApp.servSelecVolunt[0].proveedorTelefono+`')" class="external">`+foodieApp.servSelecVolunt[0].proveedorTelefono+`</a></li>
                <li class='email'><span>`+foodieApp.traducciones.general.email+`</span>: `+foodieApp.servSelecVolunt[0].proveedorEmail+`</li>
                <li class='horario'><span>`+foodieApp.traducciones.general.schedule+`</span>: <br><br>`+horario+`</li>
          </ul>

          <h2 class="beneficiario">`+foodieApp.traducciones.general.beneficiary+`</h2>
          <ul class="datos">
            <li class="beneficiario"><span>`+foodieApp.traducciones.general.beneficiary+`</span>: `+foodieApp.servSelecVolunt[0].beneficiarioNombre+` `+foodieApp.servSelecVolunt[0].beneficiarioApellidos+`</li>
            <li class="direccion"><span>`+foodieApp.traducciones.general.adress+`</span>: `+foodieApp.servSelecVolunt[0].beneficiarioDireccion+`</li>
            <li class="provincia"><span>`+foodieApp.traducciones.general.province+`</span>: `+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioProvincia.toLowerCase())+`</li>
            <li class="municipio"><span>`+foodieApp.traducciones.general.town+`</span>: `+foodieApp.maysFirst(foodieApp.servSelecVolunt[0].beneficiarioMunicipio.toLowerCase())+`</li>
            <li class="cpostal"><span>`+foodieApp.traducciones.general.postalCode+`</span>: `+foodieApp.servSelecVolunt[0].beneficiarioCPostal+`</li>
            <li class="telefono"><span>`+foodieApp.traducciones.general.telephone+`</span>: <a onclick="window.open('tel:`+foodieApp.servSelecVolunt[0].beneficiarioTelefono+`')" class="external">`+foodieApp.servSelecVolunt[0].beneficiarioTelefono+`</a></li>
            <li class="email"><span>`+foodieApp.traducciones.general.email+`</span>: `+foodieApp.servSelecVolunt[0].beneficiarioEmail+`</li>
          </ul>
        `;

        $("#confirmVoluntario1 .detalle").append(contDetalle);

        // Establecemos el alto correcto de la zona con scroll (sin botón abajo)
        var aceptVoluntHeight= $("#confirmVoluntario1").height();
        $("#confirmVoluntario1 .contScroll").css({
            "height": aceptVoluntHeight-210
        });
        $('#confirmVoluntario1 .contScroll').scrollTop(0);

        //Mostramos el botón
        $("#confirmVoluntario1 button").css({
            "position": "absolute",
            "left": 0,
            "top": aceptVoluntHeight-80
        });
        $("#confirmVoluntario1 button").removeClass("noDisplay");

        // Ocultamos la lista y mostramos el detalle
        $("#confirmVoluntario1 ul.listado").addClass("noDisplay");
        $("#confirmVoluntario1 .detalle").removeClass("noDisplay");

        
    },

    //------------------------------
    // Método que genera el html para el horario
    // Se le pasa el array del horario y devuelve el html
    //------------------------------
    maquetaHorario: function(horario){

        var resultado = "<div class='container-fluid horario'>";

        horario.forEach((element)=>{
            resultado += "<div class='row no-gutters elemento'>";
            resultado += "  <div class='col-4 dia'>";
            resultado += "      <span>"+foodieApp.getDia(element.dia)+"</span>";
            resultado += "  </div>";
            resultado += "  <div class='col-8 horas'>";
            if(element.abierto == false){
                resultado += "  <span>"+foodieApp.traducciones.general.closed+"</span>";
            }
            else{
                var horasVacias = false;
                element.rangoHoras.forEach((elementHoras)=>{
                    if(elementHoras.abre == null || elementHoras.cierra == null){
                        resultado += "  <span>"+foodieApp.traducciones.general.closed+"</span>";
                        horasVacias = true;
                    }
                    else{
                        if(!horasVacias){
                            resultado += "      <div> "+elementHoras.abre+" - "+elementHoras.cierra+"</div>";
                        }                        
                    }
                });
            }
            resultado += "  </div>";
            resultado += "</div>";
        });

        resultado += "</div>";

        return resultado;

        // Estructura del horario
        /*
        <div class="container-fluid horario">

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Lunes</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                    <div> 17:00 - 20:00</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Martes</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                    <div> 17:00 - 20:00</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Miércoles</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                    <div> 17:00 - 20:00</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Jueves</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                    <div> 17:00 - 20:00</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Viernes</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                    <div> 17:00 - 20:00</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Sábado</span>
                </div>
                <div class="col-8 horas">
                    <div> 8:00 - 14:30</div>
                </div>
            </div>

            <div class="row no-gutters elemento">
                <div class="col-4 dia">
                    <span>Domingo</span>
                </div>
                <div class="col-8 horas">
                    <span>Cerrado</span>
                </div>
            </div>

        </div>
        */


    },

    //------------------------------
    // Método que devuelve la traducción del día de la semana
    // Se le pasa el día. 1 lunes, 2 martes,3 miércoles,4 jueves,5 viernes,6 sábado,7 domingo
    //------------------------------
    getDia: function(dia){

        var resultado;

        switch(dia){
            case 1:
                resultado = foodieApp.traducciones.general.monday;
                break;
            case 2:
                resultado = foodieApp.traducciones.general.tuesday;
                break;
            case 3:
                resultado = foodieApp.traducciones.general.wednesday;
                break;
            case 4:
                resultado = foodieApp.traducciones.general.thursday;
                break;
            case 5:
                resultado = foodieApp.traducciones.general.friday;
                break;
            case 6:
                resultado = foodieApp.traducciones.general.saturday;
                break;
            case 7:
                resultado = foodieApp.traducciones.general.sunday;
                break;
        }

        return resultado;

    },

    //------------------------------
    // Acciones a realizar cuando se accede a la página de beneficiario
    //------------------------------
    doBenef: function(){

        //Inicializamos la lista
        foodieApp.listBenef = [];

        // Se oculta todo
        $("#aceptBeneficiario ul.listado").addClass("noDisplay");
        $("#aceptBeneficiario ul.datos").addClass("noDisplay");
        $("#aceptBeneficiario .cantidad").addClass("noDisplay");
        

        //Ocultamos el botón
        $("#aceptBeneficiario button").addClass("noDisplay");

        //Ocultamos los botones de volver
        $("#aceptBeneficiario i.volver").addClass("noDisplay");

        // Establecemos el alto correcto de la zona con scroll (sin botón abajo)
        var aceptBenefHeight= $("#aceptBeneficiario").height();
        setTimeout(() => {
            var aceptBenefCabeceraHeight = $("#aceptBeneficiario .cabecera").height();
            $("#aceptBeneficiario .contScroll").css({
                "height": aceptBenefHeight-aceptBenefCabeceraHeight-20
            });
        }, 1500);




        $(".velo").addClass("visible");

        $.ajax({
            type: 'GET',
            headers: {
                'x-auth-token': localStorage.getItem("foodieToken")
            },
            url: foodieApp.baseUrlApi+"donacion",
            cache: false,
            crossDomain: true,
            success: function(result,status,xhr){

                // Se obtienen los datos de servicios disponibles para el usuario beneficiario
                // Si hay más de uno se muestra la lista
                // Si sólo hay uno se muestra el detalle
                // Si no hay ninguno se muestra un mensaje indicando que no hay donaciones de alimentos en la zona en ese momento

                foodieApp.listBenef = result.data;

                var numElementos = foodieApp.listBenef.length;

                // Si hay más de 1
                if(numElementos > 1){

                    // Se muestra título y subtítulo
                    // Hay varias donaciones de alimentos en tu zona
                    // Elige una de la lista y pon una cantidad si quieres Sólo una parte
                    $("#aceptBeneficiario h1").text(foodieApp.traducciones.beneficiary.title01);
                    $("#aceptBeneficiario H2").text(foodieApp.traducciones.beneficiary.subtitle01);

                    // Se muestra la lista y se oculta el detalle
                    setTimeout(() => {

                        setTimeout(() => {
                            aceptBenefCabeceraHeight = $("#aceptBeneficiario .cabecera").height();
                            $("#aceptBeneficiario .contScroll").css({
                                "height": aceptBenefHeight-aceptBenefCabeceraHeight-20
                            });

                            $("#aceptBeneficiario ul.listado").removeClass("noDisplay");
                            $("#aceptBeneficiario ul.datos").addClass("noDisplay");
                            $("#aceptBeneficiario .cantidad").addClass("noDisplay");
                            $(".velo").removeClass("visible");

                        }, 1000);


                    }, 1500);

                    // Se vacía la lista
                    $("#aceptBeneficiario ul.listado").empty();

                    // Se pintan los elementos de la lsita
                    foodieApp.listBenef.forEach((element,index) => {
                        //console.log(index+" => "+mydump(element));
                        var imagen;                        
                        switch(element.productoId){
                            case 1:
                                imagen = "meat.png";
                                break;
                            case 2:
                                imagen = "fish.png";
                                break;
                            case 3:
                                imagen = "fruit.png";
                                break;
                            case 4:
                                imagen = "vegetable.png";
                                break;
                        }
                        if(element.disponible > 0){
                            $("#aceptBeneficiario ul.listado").append("<li data-id='"+element.id+"'><img src='img/"+imagen+"' style='width: 35px; height: auto; vertical-align: middle;margin-right: 15px;'><strong>"+element.productoNombre+"</strong> "+element.disponible+" Kg</li>");
                        }                        
                    });

                }
                // Si hay 1
                else if(numElementos == 1){
                    $(".velo").removeClass("visible");
                    // Se muestra título y subtítulo
                    // Hay una donación de alimentos en tu zona
                    // Establece una cantidad para aceptar sólo una parte de la donación
                    $("#aceptBeneficiario h1").text(foodieApp.traducciones.beneficiary.title02);
                    $("#aceptBeneficiario H2").text(foodieApp.traducciones.beneficiary.subtitle02);

                    // Se muestra el detalle del servicio de la donación para poder seleccionar cantidad y confirmar
                    foodieApp.showDetailBenef(foodieApp.listBenef[0].id);

                }
                // Si no hay
                else if(numElementos < 1){
                    $(".velo").removeClass("visible");
                    // Se muestra título y subtítulo
                    // En este momento no hay donaciones en tu zona
                    // Cuando haya alguna donación en tu zona te llegará una notificación
                    $("#aceptBeneficiario h1").text(foodieApp.traducciones.beneficiary.title03);
                    $("#aceptBeneficiario H2").text(foodieApp.traducciones.beneficiary.subtitle03);

                }

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");

                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });

    },

    //------------------------------
    // Acciones a realizar cuando se quiere mostrar el detalle de un servicio en pantalla de beneficiario
    //------------------------------
    showDetailBenef: function(id){

        //Mostramos la flecha de volver si venimos de la lista
        if(foodieApp.showingDeatailBenef){
            $("#aceptBeneficiario i.volver").removeClass("noDisplay");
        }
        else{
            $("#aceptBeneficiario i.volver").addClass("noDisplay");
        }

        //Se inicializa el servicio seleccionado por el beneficiario
        foodieApp.servSelecBenef = [];

        // Se vacía la caja
        $("#aceptBeneficiario .cantidad input").val("");

        // Obtenemos el elemento del array de elementos de los servicios al beneficiario
        foodieApp.servSelecBenef = foodieApp.listBenef.filter((el)=>{
            if(el.id === id) return true;
            else return false;
        });

        // Rellenamos los datos del detalle antes de mostrarlo
        var imagen;
        var tipo;                
        switch(foodieApp.servSelecBenef[0].productoId){
            case 1:
                imagen = "meat.png";
                tipo = foodieApp.traducciones.general.meat;
                break;
            case 2:
                imagen = "fish.png";
                tipo = foodieApp.traducciones.general.fish;
                break;
            case 3:
                imagen = "fruit.png";
                tipo = foodieApp.traducciones.general.fruit;
                break;
            case 4:
                imagen = "vegetable.png";
                tipo = foodieApp.traducciones.general.vegetables;
                break;
        }

        $("#aceptBeneficiario .datos .product .foto").empty();
        $("#aceptBeneficiario .datos .product .foto").append("<img src='img/"+imagen+"' alt='"+tipo+"'>");

        $("#aceptBeneficiario .datos .product .texto").empty();
        $("#aceptBeneficiario .datos .product .texto").append("<span>"+tipo+"</span>");

        $("#aceptBeneficiario .datos .cant .texto").empty();
        $("#aceptBeneficiario .datos .cant .texto").append(foodieApp.servSelecBenef[0].disponible+" <span>"+foodieApp.traducciones.general.measure+"</span>");

        // Establecemos el alto correcto de la zona con scroll (Con botón abajo)
        var aceptBenefHeight= $("#aceptBeneficiario").height();
        $("#aceptBeneficiario .contScroll").css({
            "height": aceptBenefHeight-260
        });

        // Coclocamos el botón
        $("#aceptBeneficiario button").css({
            "position": "absolute",
            "left": 0,
            "top": aceptBenefHeight-80
        });

        // Ocultamos la lista y mostramos el detalle
        $("#aceptBeneficiario ul.listado").addClass("noDisplay");
        $("#aceptBeneficiario ul.datos").removeClass("noDisplay");
        $("#aceptBeneficiario .cantidad").removeClass("noDisplay");

        //Mostramos el botón
        $("#aceptBeneficiario button").removeClass("noDisplay");

    },


    //------------------------------
    // Método para desloguearse
    //------------------------------
    logOff: function(){

        $(".velo").addClass("visible");

        $.ajax({
            type: 'GET',
            url: foodieApp.baseUrlApi+"logout",
            cache: false,
            crossDomain: true,
            success: function(result,status,xhr){

                $(".velo").removeClass("visible");

                if(result.status == "error"){
                    // Se eliminan del localstorage los datos del usuario

                    localStorage.removeItem("idUsuario");
                    localStorage.removeItem("email");
                    localStorage.removeItem("nombre");
                    localStorage.removeItem("apellidos");
                    localStorage.removeItem("nombreUsuario");
                    localStorage.removeItem("foodieToken");
                    localStorage.removeItem("userType");

                    //Vaciamos las cajas de usuario y de password
                    $("#InputUser1").val("");
                    $("#InputPassword").val("");
                    $("#login button").prop("disabled", true);
                    $(".form-check input").prop("checked", false);
                    $("input#InputPassword").attr("type","password");

                    // Se vuelve al login
                    foodieApp.swiper.slideTo(1,0);

                }

                

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(result));
                    console.log(mydump(status));
                    console.log(mydump(xhr));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL RESULT"+"\n"
                    +"-----------------"+"\n"
                    +mydump(result)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL XHR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"*************************");

                }

            },
            error: function(xhr,status,error){

                $(".velo").removeClass("visible");

                if(localStorage.getItem("debugMode") == "true"){

                    console.log("*************************");
                    console.log("*************************");
                    console.log(mydump(xhr));
                    console.log(mydump(status));
                    console.log(mydump(error));
                    console.log("*************************");
                    console.log("*************************");

                    alert("*************************\n"
                    +"VALORES DEL XHR "+"\n"
                    +"-----------------"+"\n"
                    +mydump(xhr)+"\n"
                    +"VALORES DEL STATUS"+"\n"
                    +"-----------------"+"\n"
                    +mydump(status)+"\n"
                    +"VALORES DEL ERROR"+"\n"
                    +"-----------------"+"\n"
                    +mydump(error)+"\n"
                    +"*************************");
                }

                foodieApp.muestraAviso(foodieApp.traducciones.errors.errorConnecting+error,"danger",4000);

            }

        });


    }


}

// ///////////////////////////////
//  FUNCIÓN PARA HACER UN DUMP  //
// ///////////////////////////////

function mydump(arr,level){
    var dumped_text = "";
    if(!level) level = 0;

    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";

    if(typeof(arr) == 'object') {  
        for(var item in arr) {
            var value = arr[item];

            if(typeof(value) == 'object') { 
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += mydump(value,level+1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { 
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}