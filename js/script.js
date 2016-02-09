( function() {

    function Weather( options ) {

        this.apiKey = options.key;
        this.endpoint = options.endpoint;
        this.coordinates = {};
    }

    Weather.prototype.GetLocation = function( callback ) {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition( function(position) {
                this.coordinates.latitude = position.coords.latitude;
                this.coordinates.longitude = position.coords.longitude;
            });
        }
    };

    Weather.prototype.GetCurrentConditions = function() {

        this.GetLocation();

        //var url = this.endpoint + this.apiKey + "/conditions/q/" + location.latitude + "," + location.longitude + ".json";

        var url = this.endpoint + "weather?lat=" + this.coordinates.latitude + "&lon=" + this.coordinates.longitude;

        return this.getJSONP( url );
    };

    Weather.prototype.GetExtendedForecast = function() {

        this.GetLocation();

        //var url = this.endpoint + this.apiKey + "/forecast10day/q/" + location.latitude + "," + location.longitude + ".json";

        var url = this.endpoint + "forecast/daily?lat=" + this.coordinates.latitude + "&lon=" + this.coordinates.longitude + "&cnt=7";

        return this.getJSONP( url );
    };

    Weather.prototype.getJSON = function( url ) {
        return new Promise( function( resolve, reject ) {
            // Create a new HTTP request to the url provided
            var request = new XMLHttpRequest();

            // The 3rd parameter must be set to true in order to create an asynchronous request.
            request.open( "GET", url, true );

            request.onreadystatechange = function() {
                if ( request.readyState === 4) { // 4 is done
                    if (request.status === 200) { // 200 is OK
                        var response = JSON.parse( request.responseText );
                        resolve( response );
                    }
                    else {
                        reject( new Error( "Failed to fetch data from the API" ) );
                    }
                }
            };

            request.send();
        } );
    };

    Weather.prototype.getJSONP = function( url, callback ) {
        return new Promise( function( resolve, reject ) {
            var id = "_" + Math.round( 10000 * Math.random() );
            var callbackName = 'jsonp_callback_' + id;

            window[ callbackName ] = function( data ) {
                delete window[ callbackName ];
                var ele = document.getElementById( id );
                ele.parentNode.removeChild( ele );
                resolve( data );
            };

            var src = url + "&callback=" + callbackName;
            var script = document.createElement( "script" );

            script.src = src;
            script.id = id;
            script.addEventListener( "error", reject );
            (document.getElementsByTagName( "head" )[ 0 ] || document.body || document.documentElement ).appendChild( script );
        } );
    };

    /*********************************************************
     *  Everything after this point should go in the user's
     *  code so that they can pull the data from the library
     ********************************************************/

    function UpdateCurrentConditions( data ) {

        // Load the current weather conditions

    };

    Weather.prototype.UpdateExtendedForecast = function() {

        // Load the 7 day forecase into the table

        // Var today = data.forecast.txt_forecast.forecastday[0];

        // $("#title").html(today.title);
    };

	var weather = new Weather({
        apiKey: "0db2018041f1b5ff8a15867b51a366e8",
        endpoint: "https://api.openweathermap.org/data/2.5/"
        //apiKey: "32a975b54b3fd4d4",
        //endpoint: "https://api.wunderground.com/api/"
    });

    var currentConditions = document.querySelector( "#today" );
    currentConditions.innerHTML = weather.GetCurrentConditions();

    weather.GetExtendedForecast();


} )( );
