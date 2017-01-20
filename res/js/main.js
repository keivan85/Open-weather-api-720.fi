var openweatherAPIKey = '0b96668615bb92609290fa424719a2ea',
openweatherURL = 'http://api.openweathermap.org/data/2.5/find?lat=60.169847&lon=24.938340&cnt=30&units=metric&appid=';


$(document).ready(function(){

    $("#reload-btn").click( function(){
        $.ajax({
            type: "GET",
            url: openweatherURL + openweatherAPIKey,
            beforeSend: function(xhr) {
                $("#weather-table tr:not(:first)").remove(); 
                $("#message").show();
            }, 
            success: function(result){
                $("#message").hide()
                var eachCity = result.list;


                function toRad(Value) {
                    return Value * Math.PI / 180;
                }

                function calculateDistance(lat1, lon1, lat2, lon2) {
                    var R = 6371; // km
                    var dLat = toRad(lat2-lat1);
                    var dLon = toRad(lon2-lon1);
                    var lat1 = toRad(lat1);
                    var lat2 = toRad(lat2);

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;
                    return d;
                }

                for ( i = 0; i < eachCity.length; i++) {
                    eachCity[i].coord.dis = calculateDistance(60.169847,24.938340,eachCity[i].coord.lat,eachCity[i].coord.lon);
                }

                eachCity.sort(function(a, b) { 
                    return a.coord.dis - b.coord.dis;
                });
                

                $.each(eachCity, function(key, value) {
                  var eachrow = "<tr>"
                  + "<td>" + value.name + "</td>"
                  + "<td class='col-1'>" + 'distance: ' + Math.round(value.coord.dis *1000) / 1000 +'<br />lat:'+value.coord.lat + '<br />lon:'+value.coord.lon  + "</td>"
                  + "<td>" + value.main.temp + "</td>"
                  + "<td>" + value.wind.speed + "</td>"
                  + "</tr>";
                  $('#weather-table').append(eachrow)

              });
            },
            error: function (jqXHR, exception) {
                console.log(jqXHR);
                getErrorMessage(jqXHR, exception);
            },
        });
    });

    function getErrorMessage(jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'An error occured, please try again later, Detailed: You are not connected to network.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'An error occured, please try again later, Detailed: Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'An error occured, please try again later, Detailed: Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'An error occured, please try again later, Detailed: Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'An error occured, please try again later, Detailed: Time out error.';
        } else if (exception === 'abort') {
            msg = 'An error occured, please try again later, Detailed: Ajax request aborted.';
        } else {
            msg = 'An error occured, please try again later, Detailed: Uncaught Error.\n' + jqXHR.responseText;
        }
        $('#weather-table').html(msg);
    }
    
    var table = $('#weather-table');
    
    $('#city, #temp, #wind')
    .wrapInner('<span title="sort this column"/>')
    .each(function(){

        var th = $(this),
        thIndex = th.index(),
        inverse = false;

        th.click(function(){

            table.find('td').filter(function(){

                return $(this).index() === thIndex;

            }).sortElements(function(a, b){

                return $.text([a]) > $.text([b]) ?
                inverse ? -1 : 1
                : inverse ? 1 : -1;

            }, function(){

                    // parentNode is the element we want to move
                    return this.parentNode; 
                    
                });

            inverse = !inverse;

        });

    }); 

    
    $(".nav-toggle").click(function() {
        $("nav").toggleClass("opened");
        return false;
    });

});
