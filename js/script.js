( function() {

    function Weather( options ) {

        this.apiKey = options.apiKey;
        this.endpoint = options.endpoint;
        this.coordinates = this.GetCoordinates();
    }

    Weather.prototype.GetCoordinates = function( callback ) {
        return new Promise( function( resolve, reject ) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( resolve, reject );
            }
            else {
                reject( {
                    error: "Your browser does not support geolocation."
                } );
            }
        });
    };

    Weather.prototype.GetCurrentConditions = function() {

        // returns a Promise
        return this.coordinates
            .then( function( data ) {
                var url = this.endpoint + "weather?lat=" + data.coords.latitude + "&lon=" + data.coords.longitude + "&APPID=" + this.apiKey;

                return this.getJSONP( url );
            }.bind( this ) );
    };

    Weather.prototype.GetExtendedForecast = function() {

        // returns a Promise
        return this.coordinates
            .then( function( data ) {
                var url = this.endpoint + "forecast/daily?lat=" + data.coords.latitude + "&lon=" + data.coords.longitude + "&cnt=7"
                    + "&APPID=" + this.apiKey;

                return this.getJSONP( url );
            }.bind( this ) );
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
                        resolve ( JSON.parse( request.response ) );
                    }
                    else {
                        reject( new Error( request.response ) );
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

	var weather = new Weather({
        apiKey: "0db2018041f1b5ff8a15867b51a366e8",
        endpoint: "http://api.openweathermap.org/data/2.5/"
        //apiKey: "32a975b54b3fd4d4",
        //endpoint: "https://api.wunderground.com/api/"
    });

    weather.GetCurrentConditions().then( function( data ) {

        // Set the current description
        var currentConditionsDesc = document.querySelector( "#currentConditionsDesc" );
        currentConditionsDesc.innerHTML = data.weather[0].description;

        // Display wind information - Speed + Direction ( in degrees)
        var windData = document.querySelector( "#currentWindData" );
        var windDirection = "";

        if (348.75 <= data.wind.deg && data.wind.deg <= 360) {
            windDirection = "N";
        }
        else if (0 <= data.wind.deg && data.wind.deg <= 11.25) {
            windDirection = "N";
        }
        else if (11.25 < data.wind.deg && data.wind.deg <= 33.75) {
            windDirection = "NNE";
        }
        else if (33.75 < data.wind.deg && data.wind.deg <= 56.25) {
            windDirection = "NE";
        }
        else if (56.25 < data.wind.deg && data.wind.deg <= 78.75) {
            windDirection = "ENE";
        }
        else if (78.75 < data.wind.deg && data.wind.deg <= 101.25) {
            windDirection = "E";
        }
        else if (101.25 < data.wind.deg && data.wind.deg <= 123.75) {
            windDirection = "ESE";
        }
        else if (123.75 < data.wind.deg && data.wind.deg <= 146.25) {
            windDirection = "SE";
        }
        else if (146.25 < data.wind.deg && data.wind.deg <= 168.75) {
            windDirection = "SSE";
        }
        else if (168.75 < data.wind.deg && data.wind.deg <= 191.25) {
            windDirection = "S";
        }
        else if (191.25 < data.wind.deg && data.wind.deg <= 213.75) {
            windDirection = "SSW";
        }
        else if (213.75 < data.wind.deg && data.wind.deg <= 236.25) {
            windDirection = "SW";
        }
        else if (236.25 < data.wind.deg && data.wind.deg <= 258.75) {
            windDirection = "WSW";
        }
        else if (258.75 < data.wind.deg && data.wind.deg <= 281.25) {
            windDirection = "W";
        }
        else if (281.25 < data.wind.deg && data.wind.deg <= 303.75) {
            windDirection = "WNW";
        }
        else if (303.75 < data.wind.deg && data.wind.deg <= 326.25) {
            windDirection = "NW";
        }
        else if (326.25 < data.wind.deg && data.wind.deg < 348.75) {
            windDirection = "NNW";
        }

        windData.innerHTML = data.wind.speed + " " + windDirection;

        // Display humidity information (in percent)
        var currentHumidity = document.querySelector( "#currentHumidity" );
        currentHumidity.innerHTML = data.main.humidity + "%";

        // Display the pressure (in hPa)
        var currentPressure = document.querySelector( "#currentPressure" );
        currentPressure.innerHTML = data.main.pressure + " hPa";
    })

    //weather.GetExtendedForecast();

} )( );
