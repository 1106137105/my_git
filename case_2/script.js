$(document).ready(function() {
	var init_present_location_YN = 1;  //get present location city and weather when APP initiates default, 0: No, 1: Yes
	
    //選擇縣市 select city button function .btn_city_select
    $(".btn_city_select").click(function(){
		var city_select = $(this).text();
		getTaiwanWeather(city_select);
        $(".collapse").collapse("hide");  // hide collapse 收起
    });
	
	function getTaiwanWeather(city_name) {
		//Weather Forecast Open Data API
		var Your_Weather_API_key = "CWB-DF9C065C-4BE1-4E19-85B6-3496DF3DA85D";  //IMPORTANT, replace it with your weather API Authkey 中央氣象局授權碼
		//中央氣象局 F-C0032-001 一般天氣預報-今明 36 小時天氣預報資料 API 全部縣市
		var url_all = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=" + Your_Weather_API_key + "&format=JSON";
		//中央氣象局 F-C0032-001 一般天氣預報-今明 36 小時天氣預報資料 API by 縣市
		var url_city = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=" + Your_Weather_API_key + "&format=JSON&locationName=";
		var jqxhr = $.getJSON(url_city + city_name, function() {
			// console.log("Get Taiwan weather success.");
		})
		.done(function(arr) {
			console.log("The second success.");
			// var outStr = JSON.stringify(arr);
			
			var time_1 = arr.records.location[0].weatherElement[0].time[0].startTime.substr(5,8).replace("-","/") + "時";
			var time_2 = arr.records.location[0].weatherElement[0].time[1].startTime.substr(5,8).replace("-","/") + "時";
			var time_3 = arr.records.location[0].weatherElement[0].time[2].startTime.substr(5,8).replace("-","/") + "時";
			//主時間 Day 2, 3, 4 時間資料 #date, #day2, day3, day4
			$("#city").text(city_name);
			$("#date").text(time_1.substr(0,5));
			$("#day2").text(time_1);
			$("#day3").text(time_2);
			$("#day4").text(time_3);
			
			//天氣概況 #weather-description
			var weather_1 = arr.records.location[0].weatherElement[0].time[0].parameter.parameterName;
			var weather_value_1 = arr.records.location[0].weatherElement[0].time[0].parameter.parameterValue;
			var weather_value_2 = arr.records.location[0].weatherElement[0].time[1].parameter.parameterValue;
			var weather_value_3 = arr.records.location[0].weatherElement[0].time[2].parameter.parameterValue;
			$("#weather-description").text(weather_1);
			//skycons.set("weather-icon", icon); https://github.com/darkskyapp/skycons {"clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind", "fog"}
			//Use dictionary to map weather icon (ForecastElement.PDF)
			var weather_dict = {1:"clear-day",2:"partly-cloudy-day",3:"partly-cloudy-day",4:"partly-cloudy-day",5:"cloudy",6:"cloudy",7:"cloudy",8:"rain",9:"rain"};
			
			// console.log(weather_value_1,weather_value_2,weather_value_3);
			var skycons = new Skycons({"color": "#A9DD9B"});
			skycons.set("weather-icon", weather_dict[weather_value_1]);
			skycons.set("weather-icon-day2", weather_dict[weather_value_1]);
			skycons.set("weather-icon-day3", weather_dict[weather_value_2]);
			skycons.set("weather-icon-day4", weather_dict[weather_value_3]);
			skycons.play();
			
			//舒適度 #feels-like
			var fl_1 = arr.records.location[0].weatherElement[3].time[0].parameter.parameterName;
			$("#feels-like").text(fl_1);
			
			//溫度 #temp #day2-high-low, day3-high-low, day4-high-low
			var minT_1 = arr.records.location[0].weatherElement[2].time[0].parameter.parameterName;
			var minT_2 = arr.records.location[0].weatherElement[2].time[1].parameter.parameterName;
			var minT_3 = arr.records.location[0].weatherElement[2].time[2].parameter.parameterName;
			var maxT_1 = arr.records.location[0].weatherElement[4].time[0].parameter.parameterName;
			var maxT_2 = arr.records.location[0].weatherElement[4].time[1].parameter.parameterName;
			var maxT_3 = arr.records.location[0].weatherElement[4].time[2].parameter.parameterName;
			$("#temp").text(Math.round((Number(minT_1) + Number(maxT_1)) / 2) + "°");
			$("#day2-high-low").text(minT_1 + "~" + maxT_1 + "°C");
			$("#day3-high-low").text(minT_2 + "~" + maxT_2 + "°C");
			$("#day4-high-low").text(minT_3 + "~" + maxT_3 + "°C");
			
			//降雨機率 #day2-precip, day3-precip, day4-precip
			var rain_1 = arr.records.location[0].weatherElement[1].time[0].parameter.parameterName;
			var rain_2 = arr.records.location[0].weatherElement[1].time[1].parameter.parameterName;
			var rain_3 = arr.records.location[0].weatherElement[1].time[2].parameter.parameterName;
			$("#day2-precip").text(rain_1 + "%");
			$("#day3-precip").text(rain_2 + "%");
			$("#day4-precip").text(rain_3 + "%");
		})
		.fail(function() {
			console.log("Get Taiwan weather fail!");
		})
		.always(function() {
			// console.log("Get Taiwan weather complete.");
		});
	}
	
	//華氏攝氏轉換 Celsius & Fahrenheit conversion function
	function C2F(c_degree) {
		var f_degree = Math.round(Number(c_degree) * 9 / 5 + 32);
		return f_degree;
	}
	
	function F2C(f_degree) {
		var c_degree = Math.round((Number(f_degree) - 32) * 5 / 9);
		return c_degree;
	}
	
	//#cbutton 將華氏轉攝氏
	$("#cbutton").click(function(event) {
		today_T_length = $("#temp").text().length;
		today_T = $("#temp").text().substring(0,today_T_length - 1);
		$("#temp").text(F2C(today_T) + "°");
	});//end cbutton
	
	//#fbutton 將攝氏轉華氏
	$("#fbutton").click(function(event) {
		today_T_length = $("#temp").text().length;
		today_T = $("#temp").text().substring(0,today_T_length - 1);
		$("#temp").text(C2F(today_T) + "°");
	});//end fbutton
	
	//Get present location city name 取得使用者所在縣市
	function getLocationCity() {
		if (navigator.geolocation) {
			var options={timeout:10000};
            navigator.geolocation.getCurrentPosition(getPosition, showError, options);
        } else {
            alert("Your device doesn't support Geolocation service.");
        }
		
		function getPosition(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			
			//Reverse geocoding is the process of converting geographic coordinates into a human-readable address.
			//Google reverse geocoding API
			// var Your_Google_API_key = "";  //IMPORTANT, replace it with your Google API Authkey.
			// var reverse_api = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&language=zh-TW&key=" + Your_Google_API_key;
			
			//Reverse geocoding by LocationIQ https://locationiq.com/
			var Your_LocationIQ_Token = "8988dc6235024d";  //IMPORTANT, replace it with your LocationIQ API Token
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://us1.locationiq.com/v1/reverse.php?key=" + Your_LocationIQ_Token + "&lat=" + lat + "&lon=" + lon + "&format=json",
				"method": "GET"
			}

			$.ajax(settings).done(function (response) {
				var loc_city = response.address.city;
				getTaiwanWeather(loc_city);
			});
		}
		
		function showError(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
					alert("User denied the request for Geolocation.");
					break;
				case error.POSITION_UNAVAILABLE:
					alert("Location information is unavailable.");
					break;
				case error.TIMEOUT:
					alert("The request to get user location timed out.");
					break;
				case error.UNKNOWN_ERROR:
					alert("An unknown error occurred.");
					break;
			}			
		}
	}//end getLocationCity()
	
	//Call getLocationCity() to get location city name and weather
	if (init_present_location_YN == 1) {
		getLocationCity();
	}
});//end ready
