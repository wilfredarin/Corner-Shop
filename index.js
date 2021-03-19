// Add API Key here 

var api_nearest_road = "";
var api_gecoding = "";



var numberRoads = [];
function main(){
	
	var cordinates = $('#cordinates-inp').val();
	var lat_long = cordinates.split(",");
	var cords = lat_long[0]+","+lat_long[1].slice(1);	
	


	var changeLat = 0.000010;
	var changeLon = 0.000010;
	
	var southla = (parseFloat(lat_long[0])-changeLat).toString()+","+lat_long[1].slice(1);
	var northla = (parseFloat(lat_long[0])+changeLat).toString()+","+lat_long[1].slice(1);
	var eastlo = lat_long[0]+","+(parseFloat(lat_long[1].slice(1))+changeLon).toString();
	var westlo = lat_long[0]+","+(parseFloat(lat_long[1].slice(1))-changeLon).toString();
	
	//search in four directions 
	fetch(cords,"display-road");
	fetch(southla,"display-road-south");
	fetch(northla,"display-road-north");
	fetch(westlo,"display-road-west");
	fetch(eastlo,"display-road-east");

	
}
function fetch(point,disBlock){
	// console.log(disBlock,point)
	var xhrRequest = new XMLHttpRequest();	
	

	//after the api is does get request this onload function runs
	xhrRequest.onload = function(){
		// console.log(xhrRequest.response);
		var respJson = JSON.parse(xhrRequest.response);
		var a = respJson.snappedPoints;
		//if respsonse returned is empty then print no road
		if (Object.keys(respJson).length == 0){
			$("#"+disBlock).text("No Nearby Road");
		}
		//get place id of the response (first road's place id)
		var placeId =  (a[0].placeId);
		console.log(placeId);
		//check if number of place id>1 -> Corner Road
		if (numberRoads.indexOf(placeId)==-1){
			numberRoads.push(placeId);
			if (numberRoads.length>1){
				$("#display-road-prob").text('Corner Shop');	
				window.alert("It's a Corner Shop, Refresh to Check New Coordinates");		
			}
		}

		// get the place name from place id
		var url = "https://maps.googleapis.com/maps/api/geocode/json?place_id="+placeId
					+"&key="+api_gecoding;
		
		xhrRequest.onload = function(){
								// console.log(xhrRequest.response);
								var placeName= JSON.parse(xhrRequest.response);
								var b = placeName.results[0].formatted_address;
								$("#"+disBlock).text("Road Name : "+b);
								
							}
		xhrRequest.open('get',url);
		xhrRequest.send();				
	}
	
	xhrRequest.open('get',"https://roads.googleapis.com/v1/nearestRoads?points="+point+"&key="+api_nearest_road);
	xhrRequest.send();
	
	
};



//when submit is clicked this main function will be called
$('#corner-road').click(main);