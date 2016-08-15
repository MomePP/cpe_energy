var serverURL = "https://data.learninginventions.org/channels/";

var config = { results:1000, dynamic:false };

var fieldTxt = "field";
var params	= {};
var channel = {fields:[],names:[],data:{}};
var validTypes = ["line","column","spline"];
var suffix = ["Wh","V","A","Watt"]
var getDatepicker=[];
var valueplot = [];
var unitUsedAllInRoom =[[],[]];

var offsetChannel = 101;
var list = []
var max,timemax;
var saveData = [];
var lastUpdate ;
var numAir = [];
var nameOfSeries ;
var max = 0;
var maxNo = 0;
var lastEntry = [];
var roomData = [{"name":"401","list":[{"no":30},{"no":31},{"no":28}],"sum_unit_used":0},{"name":"402","list":[{"no":1},{"no":3},{"no":5}],"sum_unit_used":0},{"name":"403","list":[{"no":4}],"sum_unit_used":0},{"name":"404","list":[{"no":2}],"sum_unit_used":0},{"name":"405","list":[{"no":6}],"sum_unit_used":0},{"name":"406","list":[{"no":7},{"no":9}],"sum_unit_used":0},{"name":"407","list":[{"no":11}],"sum_unit_used":0},{"name":"409","list":[{"no":8}],"sum_unit_used":0},{"name":"410","list":[{"no":10}],"sum_unit_used":0},{"name":"411(LD)","list":[{"no":13},{"no":15}],"sum_unit_used":0},{"name":"411","list":[{"no":12}],"sum_unit_used":0},{"name":"412(4th)","list":[{"no":20}],"sum_unit_used":0},{"name":"412(1)","list":[{"no":16}],"sum_unit_used":0},{"name":"412(2)","list":[{"no":14}],"sum_unit_used":0},{"name":"412(N)","list":[{"no":34}],"sum_unit_used":0},{"name":"413","list":[{"no":21},{"no":23}],"sum_unit_used":0},{"name":"413(Gra)","list":[{"no":19},{"no":24}],"sum_unit_used":0},{"name":"414","list":[{"no":26}],"sum_unit_used":0},{"name":"415(LIL)","list":[{"no":25},{"no":29}],"sum_unit_used":0},{"name":"415(3rd)","list":[{"no":22},{"no":29}],"sum_unit_used":0},{"name":"SIPA","list":[{"no":32}],"sum_unit_used":0},{"name":"422","list":[{"no":33}],"sum_unit_used":0}];


var room4rdFloor = [["401","28","30","31"],
            ["402","1","3","5"],
            ["403","4"],
            ["404","2"],
            ["405","6"],
            ["406","7","9"],
            ["407","11"],  //**
            ["409","8"],
           ["410","10"],
            ["411(LD)","13","15"],
            ["411","12,17"],  //**
            ["412(4th)","18","20"],
          ["412(1)","16"],
            ["412(2)","14"],
            ["412(N)","34"],
            ["413","21","23"],
            ["413(Gra)","19","24"],
            ["414","26"],
            ["415(LIL)","25","29"],
            ["415(3rd)","22","29"],
            ["SIPA","32"],
           ["422","33"], //21
            ];



var isLoading = {};
var seriesOptions = []
var seriesOptions2 = []
var seriesCounter = 0

// create the chart when all data is loaded
createChart = function () {
	var roomID = Number(getUrlParameter("roomID"));
	$('#container').highcharts( 'StockChart', {
		chart : {
			
			//events : {
			//	load : function () {
			//		var series2 = this.series.slice(0,this.series.length-1);
					//handleLoaded(series2);
			//	}
			//}
		},
		
		title: {
			text: params.roomID +" - UNIT"  ,
			style: {
				color: '#2c3e50',
				fontSize: '36px'	
			}
		},
		rangeSelector: {
			buttons: [
				{
					type: 'minute',
					count: 30,
					text: '30min'
				},
				{
					type: 'hour',
					count: 1,
					text: '1hr'
				},
				{
					type: 'day',
					count: 1,
					text: '1d'
				},
				{
					type: 'week',
					count: 1,
					text: '1w'
				},
				{
					type: 'month',
					count: 1,
					text: '1m'
				}, {
					type: 'ytd',
					text: 'YTD'
				}, {
					type: 'year',
					count: 1,
					text: '1y'
				}, {
					type: 'all',
					text: 'All'
				}]
			},

			yAxis: {
            	
            	plotLines: [{
                	value: 0,
                	width: 2,
                	color: 'white'
            	}]
        	},
			

			// legend: {
			// 	enabled: true,
			// 	layout: 'horizontal',
			// 	align: 'bottom',
			// 	borderWidth: 0
			// },
			legend: {
				enabled: true,
				layout: 'vertical',
				align: 'left',
				verticalAlign: "top",
				floating: true,
				y: 0
			},
			    tooltip: {
        valueDecimals: 2,
    },
			

			// plotOptions: {
			// 	// series: {
			// 	//     compare: 'percent'
			// 	// }
			// 	enabled: true

			// },

			 plotOptions: {
   //          	line: {
   //              	dataLabels: {
   //               	   enabled: false
   //              	},
   //              	enableMouseTracking: true
   //          	}
   				bar: {
					dataLabels: {
						enabled: true
					}
				}
         	},

			series:  seriesOptions
        
		});
	};
createChart2 = function () {
	var roomID = Number(getUrlParameter("roomID"));
	$('#container2').highcharts( 'StockChart', {
		chart : {
			
			//events : {
			//	load : function () {
			//		var series2 = this.series.slice(0,this.series.length-1);
					//handleLoaded(series2);
			//	}
			//}
		},
		
		title: {
			text: params.roomID +" - CURRENT"  ,
			style: {
				color: '#2c3e50',
				fontSize: '36px'	
			}
		},
		rangeSelector: {
			buttons: [
				{
					type: 'minute',
					count: 30,
					text: '30min'
				},
				{
					type: 'hour',
					count: 1,
					text: '1hr'
				},
				{
					type: 'day',
					count: 1,
					text: '1d'
				},
				{
					type: 'week',
					count: 1,
					text: '1w'
				},
				{
					type: 'month',
					count: 1,
					text: '1m'
				}, {
					type: 'ytd',
					text: 'YTD'
				}, {
					type: 'year',
					count: 1,
					text: '1y'
				}, {
					type: 'all',
					text: 'All'
				}]
			},

			yAxis: {
            	
            	plotLines: [{
                	value: 0,
                	width: 2,
                	color: 'white'
            	}]
        	},
			

			// legend: {
			// 	enabled: true,
			// 	layout: 'horizontal',
			// 	align: 'bottom',
			// 	borderWidth: 0
			// },
			legend: {
				enabled: true,
				layout: 'vertical',
				align: 'left',
				verticalAlign: "top",
				floating: true,
				y: 0
			},
			tooltip: {
        valueDecimals: 2,
   			 },
			
			

			// plotOptions: {
			// 	// series: {
			// 	//     compare: 'percent'
			// 	// }
			// 	enabled: true

			// },

			 plotOptions: {
   //          	line: {
   //              	dataLabels: {
   //               	   enabled: false
   //              	},
   //              	enableMouseTracking: true
   //          	}
   				bar: {
					dataLabels: {
						enabled: true
					}
				}
         	},

			series:  seriesOptions2
        
		});
	};


	var updateChannelShow = function(data){
		channel = $.extend(channel, data.channel);
		setFields(data);
		initData(data);
	}

	function getChannelInfo(callback){

		$.getJSON( serverURL+params.roomID, callback).fail(function() {
			alert("Invalid parametors");

		});

	}

	

	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		var datas = {};
		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			datas[sParameterName[0]] = sParameterName[1];
			if (sParameterName[0] == sParam)
			{
				return sParameterName[1];
			}
		}
		return datas;
	}

	function validateParams(){
		var datas = getUrlParameter();
		if ( !datas.roomID) {
			alert("Invalid Room ID");
			return false;
		} 

		return true;
	}




	function parseDataLog(data){
		var date = new Date(data.datetime);
		var localdate = date-1*date.getTimezoneOffset()*60*1000;
		data.datetime = localdate;
		data.value    = Number(data.value);
		return data;
	}
	function increseData(data){
		var date = new Date(data.datetime);
		console.log(date)
		var localdate = date+1*date.getTimezoneOffset()*60*1000;
		data.datetime = localdate;
		data.value    = Number(data.value);
		return data;
	}

	function plotRealTime(valueplot) {

    	document.getElementById("Energy.value").innerHTML = valueplot[0];
    	document.getElementById("Voltage.value").innerHTML = valueplot[1];
    	document.getElementById("Current.value").innerHTML = valueplot[2];
    	document.getElementById("Power.value").innerHTML = valueplot[3];
    	console.log(valueplot);

	}
	

	

function fetchData(option){
    console.log("Loading...");
    var roomCounter = 0;

    $.each(roomData, function(room_index, room){
            if (room.name!=params.roomID){return;}
            	console.log(room.name)
            	console.log(room.list)
            var sensorCounter = 0;
            var parsedData
            $.each(room.list, function(sensor_index, sensor){
            	 list= [];
                
                var channelID   = offsetChannel+sensor.no;
                var nameOfSeries = "A/C No. "+sensor.no
                var field       = option.field ;
                var maxValue = 0;
                var fetch_url   = serverURL+channelID+'/field/'+field+'.json?'+$.param(option);
                console.log(fetch_url)
                
                $.getJSON(fetch_url, function (data) {
                   
				
				list = [];
				for (var index in data.feeds){
				var record = data.feeds[index]	
				parsedData = parseDataLog({ datetime:record.created_at,value:record["field"+field]});
				list.push( [parsedData.datetime, parseFloat((parsedData.value).toFixed(2))] )
				console.log(parseFloat((parsedData.value).toFixed(2)))
				lastUpdate = record.created_at
				
						
				}
					 if (field == 1) {

					 lastEntry.push([sensor.no,parsedData.value])
					seriesOptions[sensor_index] ={
								name : nameOfSeries,
							data : list}

                    	}
						 if (field == 3) {		
					seriesOptions2[sensor_index] ={
							name : nameOfSeries,
								data : list}
								
						}
    				
    					
								
						
						
									
					

                }).complete(function() { 
                    console.log("complete");
                    sensorCounter += 1;
                    if (sensorCounter === room.list.length&&field == 1) {
                        roomCounter += 1;
                       
                            // console.log(roomData);
                            createChart();
                            
                           	lastStat(seriesOptions)
                           	for (var i = lastEntry.length - 1; i >= 0; i--) {
                           		
                           		if (lastEntry[i][1] > maxValue){
                           				maxValue = lastEntry[i][1]
                           				maxNo = lastEntry[i][0]
                           			}
                           		
                           	};
                           	
                           
                            document.getElementById("Max.value").innerHTML = maxValue.toFixed(2)+ " kWh";
							document.getElementById("Max.no").innerHTML = "No. " + maxNo;
                            
                        
                        
                    } 
                    if (sensorCounter === room.list.length&&field == 3) {
                        roomCounter += 1;
                       
                            // console.log(roomData);
                           createChart2();
                        calStat(seriesOptions2)
                    } 
                  	
					
                });  
					
              
            });
		

});

return ;
}
function calStat (datain) {
	var sensor 
	console.log(datain)
	for (var index in datain) {
		
	
	data = datain[index].data;
	name = datain[index].name;
	
	
	for (var index in data) {
		if (data[index][1] == 0 && max == 0 ) {
			timemax = "No peak"  
			sensor = "Anyone"
			};
		if (data[index][1] > max ){ 
			max = data[index][1];
		timemax = moment(data[index][0]-25200000).format('YYYY-MM-DD HH:mm:ss')  
	sensor = name
	console.log(max,timemax,sensor)
}
			
		}
		
		
		
		};
		document.getElementById("peak.value").innerHTML = max.toFixed(2) + " A";
		document.getElementById("peak.time").innerHTML = timemax;
		document.getElementById("peak.no").innerHTML = sensor;
	
	}
function lastStat (data) {
		data = data[0].data;
		sumValue = 0
		order = 0		
		for(var index in lastEntry){
			sumValue +=lastEntry[index][1]
			}
		
		lastUnitEntryDate = moment(data[data.length-1][0]-25200000).format('YYYY-MM-DD HH:mm:ss')
		lastUnitEntry = sumValue
		

		document.getElementById("Unit.value").innerHTML = lastUnitEntry.toFixed(2)+ " kWh";
		document.getElementById("Unit.time").innerHTML = lastUnitEntryDate;
}





	function handleLoaded(series){

		// push data every 5 seconds
		setInterval(function() {

			var option = {results : config.results, api_key : params.api_key, start:channel.updated_at}
			var fetch_url = serverURL+params.channelID+'/feeds.json?'+$.param(option)+'&start='+getDatepicker[0]+'&end='+getDatepicker[1];
			var valueplot = [];

			$.getJSON(fetch_url,    function (data) {
				
				if (data.feeds){
					$.each(data.feeds, function (index, record) {
							
						$.each(channel.list, function (i, name) {
								
							if(record.entry_id > channel.data[name].last_entry_id && record[fieldTxt+name]){
								var parsedData = parseDataLog({ datetime:record.created_at,value:record[fieldTxt+name] });
								series[i].addPoint([parsedData.datetime,parsedData.value], true, true);
								channel.data[name].last_entry_id = record.entry_id;
								valueplot[i] = parsedData.value.toFixed(2) ;
								plotRealTime(valueplot);

							};

							channel.data[name].updated_at = data.channel.updated_at;
							channel.updated_at = data.channel.updated_at;
							
							
						});

					});

				}

			});
		}, 5000);

	}

function getTimedate() {

    start = getUrlParameter('start');
    end = getUrlParameter('end');

    start = (typeof start == 'string') ? moment(decodeURI(start)) : moment().subtract(30, 'days');
    end = (typeof end == 'string') ? moment(decodeURI(end)) : moment();
    initDatePicker();
    document.getElementById("container").innerHTML = "Please wait a moment";
    
    cb(start, end);  
   
}

function cb(start, end) {

        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' to ' + end.format('MMMM D, YYYY'));
        console.log(moment(start).format('YYYY-MM-DD HH:mm:ss'))
        console.log(moment(end).format('YYYY-MM-DD HH:mm:ss'))
       
       	channelKey =0
        params = getUrlParameter();
    	validateParams();

    	
    			//saveData[i][j] = getDataValue(start._d,end._d,102+room4rdFloor[i][j]);
    			
    			//getDataValue(3,,101+Number(room4rdFloor[i][j]))
    		fetchData({field: 1 ,start : moment(start).format('YYYY-MM-DD HH:mm:ss'),end : moment(end).format('YYYY-MM-DD HH:mm:ss')});
    		fetchData({field: 3 ,start : moment(start).format('YYYY-MM-DD HH:mm:ss'),end : moment(end).format('YYYY-MM-DD HH:mm:ss')});
    			
    			//getDataValue(start._d,end._d,101+Number(room4rdFloor[i][j]))
    		document.getElementById("lastTimeUpdate").innerHTML = moment(lastUpdate).format('YYYY-MM-DD HH:mm:ss');
    		document.getElementById("RoomIdHtml").innerHTML = "Room  : "+  params.roomID;
    		document.title = params.roomID   + " - Power Usage ";
        return;
        //Fetch channel information

    }


function initDatePicker(){
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment().startOf('day'), moment()],
           'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        timePicker: true,
        timePicker24Hour: true,
   

    }, function(start,end){
        console.log(end)
        setQueryParameters({roomID:params.roomID,start:start.format('YYYY-MM-DD HH:mm:ss'),end:end.format('YYYY-MM-DD HH:mm:ss')

    })


    });
}

function setQueryParameters(params) {
  var query = [],
      key, value;

  for(key in params) {
    if(!params.hasOwnProperty(key)) continue;
    value = params[key];
    query.push(key + "=" + value);
  }

  location.search = query.join("&");
}

