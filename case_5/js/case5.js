// pageF1 功能1-取得JSON資料
$(document).on("pagecreate","#pageF1",function() {
    $(document).on("pageshow","#pageF1",function() {
        console.log("pageshow Event 每次開啟頁面都會被觸發！");
    });

    // var url = "http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C&FolderType=";
    console.log("pagecreate Event 只會被觸發一次！");
    var url = "case5.json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);
            var htmlText = "<table data-role='table' class='ui-responsive'><thead><tr><th>Name</th><th>Px</th><th>Py</th></tr></thead>";
            for (i=0;i<myObj.length;i++) {
                htmlText += "<tbody><tr><td>" + myObj[i].Name + "</td><td>" + myObj[i].Py + "</td><td>" + myObj[i].Px + "</td></tr></tbody>";
            }
            htmlText + "</table>";
            $("#pf1_d1").html(htmlText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
});


// pageF2 功能2-取得地理位置 geolocation
$(document).on("pagecreate","#pageF2",function() {
    $("#pf2_b1").on("vclick", function(event) {
        function getLocation() {
            if (navigator.geolocation) {
            	// timeout at 10000 milliseconds (10 seconds)
                var options = {timeout:10000};
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else {
                $("#pf2_d1").text("Geolocation is not supported by this browser.");
            }
        }
        
        function showPosition(position) {
            var htmltext = "Latitude(緯度): " + position.coords.latitude + 
            "<br>Longitude(經度): " + position.coords.longitude +
            "<br>位置精確度: " + position.coords.accuracy +
    		"<br>高度: " + position.coords.altitude +
    		"<br>高度精確度: " + position.coords.altitudeAccuracy +
    		"<br>方位: " + position.coords.heading +
    		"<br>速度: " + position.coords.speed +
    		"<br>時間: " + position.timestamp;
    		
            $("#pf2_d1").html(htmltext);

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlon = new google.maps.LatLng(lat, lon)
            var mapholder = document.getElementById('pf2_d2')
            mapholder.style.height = '300px';
            mapholder.style.width = '100%';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(mapholder, myOptions);
            var marker = new google.maps.Marker({position:latlon,map:map,title:"目前位置!"});
        }
        
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    $("#pf2_d1").text("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    $("#pf2_d1").text("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    $("#pf2_d1").text("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    $("#pf2_d1").text("An unknown error occurred.");
                    break;
            }
        }
        getLocation();
    });
});


// pageF3 功能3-標記JOSN位置
$(document).on("pagecreate","#pageF3",function() {
    $("#pf3_b1").on("vclick", function(event) {
        function getLocation() {
            if (navigator.geolocation) {
            	// timeout at 10000 milliseconds (10 seconds)
                var options = {timeout:10000};
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else { 
                $("#pf3_d1").text("Geolocation is not supported by this browser.");
            }
        }
        
        function showPosition(position) {
            var htmlText = "Latitude(緯度): " + position.coords.latitude + 
            "<br>Longitude(經度): " + position.coords.longitude;
            
            $("#pf3_d1").html(htmlText);

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlon = new google.maps.LatLng(lat, lon)
            var mapholder = document.getElementById('pf3_d2')
            mapholder.style.height = '500px';
            mapholder.style.width = '100%';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(mapholder, myOptions);
            var marker = new google.maps.Marker({position:latlon,map:map,title:"目前位置!"});
            var url = "case5.json";
            var xmlhttp = new XMLHttpRequest();
            var myObj;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    myObj = JSON.parse(this.responseText);
                    for (i=0;i<myObj.length;i++) {
                        var latlon = new google.maps.LatLng(myObj[i].Py, myObj[i].Px);
                        marker = new google.maps.Marker({position:latlon,map:map,title:myObj[i].Name});
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    $("#pf3_d1").text("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    $("#pf3_d1").text("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    $("#pf3_d1").text("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    $("#pf3_d1").text("An unknown error occurred.");
                    break;
            }
        }
        getLocation();
    });
});


// pageF4 功能4-標註JSON群組呈現
// Google Map API: Marker Clustering https://developers.google.com/maps/documentation/javascript/marker-clustering?hl=zh-tw
$(document).on("pagecreate","#pageF4",function() {
    $("#pf4_b1").on("vclick", function(event) {
        var x = document.getElementById("pf4_d1");
        function getLocation() {
            if (navigator.geolocation) {
            	// timeout at 10000 milliseconds (10 seconds)
                var options = {timeout:10000};
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else { 
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
        
        function showPosition(position) {
            var htmlText = "Latitude(緯度): " + position.coords.latitude + 
            "<br>Longitude(經度): " + position.coords.longitude;
            
            $("#pf3_d1").html(htmlText);

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlon = new google.maps.LatLng(lat, lon)
            var mapholder = document.getElementById('pf4_d2')
            mapholder.style.height = '500px';
            mapholder.style.width = '100%';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(mapholder, myOptions);
            var marker = new google.maps.Marker({position:latlon,map:map,title:"目前位置!"});
            var url = "case5.json";
            var xmlhttp = new XMLHttpRequest();
            var myObj;
			var markers=[];   // 建立一個markers陣列存放marker
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    myObj = JSON.parse(this.responseText);
                    for (i=0;i<myObj.length;i++) {
                        var latlon = new google.maps.LatLng(myObj[i].Py, myObj[i].Px);
                        var marker = new google.maps.Marker({position:latlon,map:map,title:myObj[i].Name});
                		markers.push(marker);   // 把marker push到markers陣列中
                    }
                    // Add a marker clusterer to manage the markers.
				    var markerCluster = new MarkerClusterer(map, markers,
				        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }
        getLocation();
    });
});

// pageF5 功能5-標註JSON數量呈現
// Google Map API: Symbols https://developers.google.com/maps/documentation/javascript/symbols?authuser=0
$(document).on("pagecreate","#pageF5",function() {
    $("#pf5_b1").on("vclick", function(event) {
        var x = document.getElementById("pf5_d1");
        function getLocation() {
            if (navigator.geolocation) {
            	// timeout at 10000 milliseconds (10 seconds)
                var options = {timeout:10000};
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else { 
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
        
        function showPosition(position) {
            x.innerHTML = "Latitude(緯度): " + position.coords.latitude + 
            "<br>Longitude(經度): " + position.coords.longitude;

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlon = new google.maps.LatLng(lat, lon)
            var mapholder = document.getElementById('pf5_d2')
            mapholder.style.height = '500px';
            mapholder.style.width = '100%';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(mapholder, myOptions);
            var marker = new google.maps.Marker({position:latlon,map:map,title:"目前位置!"});
            var url = "case5.json";
            var xmlhttp = new XMLHttpRequest();
            var myObj;
			var markers=[];   // 建立一個markers陣列存放marker
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    myObj = JSON.parse(this.responseText);
                    for (i=0;i<myObj.length;i++) {
                        var latlon = new google.maps.LatLng(myObj[i].Py, myObj[i].Px);
                        // marker = new google.maps.Marker({position:latlon,map:map,title:myObj[i].Name});
                        var marker = new google.maps.Marker({
				            position: latlon,
				            icon: {
				                path: google.maps.SymbolPath.CIRCLE,  // 使用圖圈圖形
				                strokeColor: "white", // 線條顏色
				                strokeWeight: 1,      // 線條粗細
				                fillColor: "red",     // 填充顏色
				                fillOpacity: 0.3,     // 填充透明度
				                scale: Math.floor((Math.random()*10)+1)  // 圖形大小
				            },
				            title: myObj[i].Name,
				            map: map
				        });
						markers.push(marker);   // 把marker push到markers陣列中
                    }
					// Add a marker clusterer to manage the markers.
				    var markerCluster = new MarkerClusterer(map, markers,
				        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }
        getLocation();
    });
});

// pageF6 功能6-標註JSON距離控制
$(document).on("pagecreate","#pageF6",function() {
	$("#pf6_b1").off("vclick");    // Prevent multiple binding event.
    $("#pf6_b1").on("vclick", function(event) {
        var x = document.getElementById("pf6_d1");
        var range = ($("#pf6_dis").val()*1000); // Unit in meter
        var centerLat;  // 記錄目前位置
        var centerLon;  // 記錄目前位置
		// 檢查是否抓到距離值
		console.log("取得 Range: " + range + " 公尺(M)");
        
        function getLocation() {
            if (navigator.geolocation) {
            	// timeout at 10000 milliseconds (10 seconds)
                var options = {timeout:10000};
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else { 
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
        
        function showPosition(position) {
            x.innerHTML = "Latitude(緯度): " + position.coords.latitude + 
            "<br>Longitude(經度): " + position.coords.longitude;

            centerLat = position.coords.latitude;   // 記錄目前位置
            centerLon = position.coords.longitude;  // 記錄目前位置
            var latlon = new google.maps.LatLng(centerLat, centerLon)
            var mapholder = document.getElementById('pf6_d2')
            mapholder.style.height = '500px';
            mapholder.style.width = '100%';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(mapholder, myOptions);
            var marker = new google.maps.Marker({position:latlon,map:map,title:"目前位置!"});
            var url = "case5.json";
            var xmlhttp = new XMLHttpRequest();
            var myObj;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    myObj = JSON.parse(this.responseText);
                    for (i=0;i<myObj.length;i++) {
                    	if (getGreatCircleDistance(centerLat,centerLon,myObj[i].Py,myObj[i].Px) <= range) {
		                    var latlon = new google.maps.LatLng(myObj[i].Py, myObj[i].Px);
		                    marker = new google.maps.Marker({position:latlon,map:map,title:myObj[i].Name});
		                }
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }
        
        // 以經緯度計算2點間距離
        function getRad(d){
            var PI = Math.PI;
            return d*PI/180.0;
        }
    
        function getGreatCircleDistance(lat1,lng1,lat2,lng2) {
            var EARTH_RADIUS = 6378137.0;    //Unit: Meter
            var radLat1 = getRad(lat1);
            var radLat2 = getRad(lat2);
    
            var a = radLat1 - radLat2;
            var b = getRad(lng1) - getRad(lng2);
    
            var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
            s = s*EARTH_RADIUS;
            s = Math.round(s*10000)/10000.0;
    
            return s.toFixed(2);
        }
        getLocation();
    });
});

// pageF7 功能7-Google 地理資料庫 Google Places Library
// Google Map API: Places Library https://developers.google.com/maps/documentation/javascript/places
$(document).on("pagecreate","#pageF7",function() {
	// for 路徑建議
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

	var centerPos;
	var radius;
	var x = document.getElementById("pf7_d1");
	var map;
    var infowindow;
    
    $("#pf7_b1").off("vclick");    // Prevent multiple binding event.
	$("#pf7_b1").on("vclick", function(event) {
		radius = ($("#pf7_dis").val()*1000); // Unit in meter
		console.log("尋找範圍: " + radius + " 公尺(M)");
		getLocation();
	});

	function getLocation() {
		if (navigator.geolocation) {
            var options = {timeout:10000}; // timeout at 10000 milliseconds (10 seconds)
			navigator.geolocation.getCurrentPosition(showPosition,showError,options);
		} else {
			x.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	function showPosition(position) {
		centerLat = position.coords.latitude;
		centerLon = position.coords.longitude;
		x.innerHTML = "目前位置 Latitude(緯度): "+centerLat+" , Longitude(經度): "+centerLon;
		
		centerPos = new google.maps.LatLng(centerLat,centerLon);
		var thisMap = document.getElementById("pf7_d2");
		thisMap.style.height = '500px';
		thisMap.style.width = '100%';

		map = new google.maps.Map(thisMap, {
			center: centerPos,
			zoom: 15
		});
		// 標註目前位置
		var marker = new google.maps.Marker({position:centerPos,map:map,title:"目前位置!"});

		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: centerPos,
			radius: radius,
			keyword: "麥當勞",
			type: ['restaurant']
		}, callback);
	}

	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		google.maps.event.addListener(marker, "click", function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});

		google.maps.event.addListener(marker,"dblclick",function() {
			directionsDisplay.setMap(map);
			directionsService.route({
				origin: centerPos,
				destination: placeLoc,
				travelMode: 'DRIVING'
			}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					var dirStepArr = response.routes[0].legs[0];
					var dirStep = dirStepArr.steps.length;
					alert(dirStep);
					// If route steps exist?
					if (dirStep>0) {
						var stepString = "";
						for (var i=0;i<dirStep;i++) {
							stepString += dirStepArr.steps[i].instructions.trim();
						}
						x.innerHTML = stepString;
					}
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		});
	}

	function showError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				x.innerHTML = "User denied the request for Geolocation."
				break;
			case error.POSITION_UNAVAILABLE:
				x.innerHTML = "Location information is unavailable."
				break;
			case error.TIMEOUT:
				x.innerHTML = "The request to get user location timed out."
				break;
			case error.UNKNOWN_ERROR:
				x.innerHTML = "An unknown error occurred."
				break;
		}
	}
});


// pageF8 功能8-QR Code Scanner
// QR Code Scanner: schmich/instascan https://github.com/schmich/instascan
$(document).on("pagecreate","#pageF8",function() {
	$("#pf8_b1").off("vclick");    // Prevent multiple binding event.
    $("#pf8_b1").on("vclick", function(event) {
    	var app = new Vue({
			el: '#qrcodeapp',
			data: {
				scanner: null,
				activeCameraId: null,
				cameras: [],
				scans: []
			},
			mounted: function () {
				var self = this;
				self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
				self.scanner.addListener('scan', function (content, image) {
					self.scans.unshift({ date: +(Date.now()), content: content });
				});
				Instascan.Camera.getCameras().then(function (cameras) {
					self.cameras = cameras;
					if (cameras.length > 0) {
						self.activeCameraId = cameras[0].id;
						self.scanner.start(cameras[0]);
					} else {
						console.error('No cameras found.');
					}
				}).catch(function (e) {
					console.error(e);
				});
			},
				methods: {
					formatName: function (name) {
					return name || '(unknown)';
				},
					selectCamera: function (camera) {
					this.activeCameraId = camera.id;
					this.scanner.start(camera);
				}
			}
		});
    });
});

