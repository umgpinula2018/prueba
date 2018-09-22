// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

(function () {
    var filesResource = 'https://' + tenant + '-my.sharepoint.com'
    var endpoints = 
    {
        filesResource: filesResource,
    };    

    // Enter Global Config Values & Instantiate ADAL AuthenticationContext
    window.config = 
    {
        tenant: tenant + '.onmicrosoft.com',                 
        clientId: clientId,
        postLogoutRedirectUri: window.location.origin,
        //postLogoutRedirectUri: "http://localhost/fifcoone-web/public/",
        endpoints: endpoints,
        cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };
     
    var authContext = new AuthenticationContext(config);

    // Get UI jQuery Objects
    var $panel         = $(".panel-body");
    var $userDisplay   = $(".app-user");
    var $signInButton  = $(".app-login");
    var $signOutButton = $(".app-logout");
    var $errorMessage  = $(".error-app");
    var $sinsesion     = $(".sinsesion");
    var $continuar     = $(".app-continuar");
    
    // Check For & Handle Redirect From AAD After Login
    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();
    $errorMessage.html(authContext.getLoginError());

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }

    // Check Login Status, Update UI
    var user = authContext.getCachedUser();
    if (user) 
    {
        $("#titulo").html("Bienvenido " + user.profile.given_name);
        localStorage.setItem("NOMBRE", user.profile.given_name);
        localStorage.setItem("USUARIO", user.userName);
        localStorage.setItem("OBJETO",  JSON.stringify(user));
        $("#logo-office").hide();

        $userDisplay.show();
        $signInButton.hide();
        $signOutButton.show();
        $continuar.show();
        $sinsesion.hide();
   } 
   
   else 
   {
        localStorage.removeItem("USUARIO");
        $userDisplay.empty();
        $userDisplay.hide();
        $signInButton.show();
        $signOutButton.hide();
        $continuar.hide();
        $sinsesion.show();

    }

    // Handle Navigation Directly to View
    window.onhashchange = function () 
    {
        loadView(stripHash(window.location.hash));
    };

    window.onload = function () 
    {
        $(window).trigger("hashchange");
    };

    // Register NavBar Click Handlers
    $signOutButton.click(function () 
    {
        authContext.logOut();
    });
    
    $signInButton.click(function () 
    {
        authContext.login();
    });
    
    $continuar.click(function () 
    {
        if( localStorage.USUARIO != '' )
        {
            $.ajax({
                url: 'ws/login_office',
                type: 'GET',
                dataType: 'json',
                data: {usuario: localStorage.USUARIO.toUpperCase(), nombre: localStorage.NOMBRE},
            })
            .done(function(e) {
                if (e.result){
                            window.location.href = "panel";
                }
                else
                {
                    alert("Usted no tiene permisos para acceder a esta plataforma");
                }
            })
            .fail(function() {
                console.log("error al iniciar sesion")
            })
            .always(function() {
                
            });
        }
    });

    // Route View Requests To Appropriate Controller
    function loadCtrl(view) 
    {
        console.log(view); 
        switch (view.toLowerCase()) 
        {
            case 'home':
                return homeCtrl;
            case 'filesapi':
                return filesApiCtrl;
            case 'userdata':
                return userDataCtrl;
        }
    }

    // Show a View
    function loadView(view) 
    {
        $errorMessage.empty();
        var ctrl = loadCtrl(view);

        if (!ctrl)
            return;

        // Check if View Requires Authentication
        if (ctrl.requireADLogin && !authContext.getCachedUser()) 
        {
            authContext.config.redirectUri = window.location.href;
            authContext.login();
            return;
        }

        // Load View HTML
        $.ajax(
        {
            type: "GET",
            url: "App/Views/" + view + '.html',
            dataType: "html",
        }).done(function (html) {

        // Show HTML Skeleton (Without Data)
        var $html = $(html);
        $html.find(".data-container").empty();
        $panel.html($html.html());
        ctrl.postProcess(html);

        }).fail(function () {
            $errorMessage.html('Error loading page.');
        }).always(function () {
         
        });
    };

    function stripHash(view) {
        return view.substr(view.indexOf('#') + 1);
    }

}());

