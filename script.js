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
var list = []
var saveData = [];
var numAir = [];
var room4rdFloor = [["401","30","31","28"],
            ["402","1","3","5"],
            ["403","4"],
            ["404","2"],
            ["405","6"],
            ["406","7","9"],
            ["407","11"],  //**
            ["409","8"],
           ["410","10"],
            ["411(4th)","13","15"],
            ["411","12"],  //**
            ["412(4th)","20"],
          ["412(1)","16"],
            ["412(2)","14"],
            ["412(N)","34"],
            ["413","21","23"],
            ["413(Gra)","19","24"],
            ["414","26"],
            ["LIL","25","29"],
            ["415(3rd)","22","29"],
            ["SIPA","32"],
           ["422","33"], //21
            ];



var isLoading = {};
var seriesOptions = [],
seriesCounter = 0,

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
			text: params.roomID ,
			style: {
				color: '#2c3e50',
				fontSize: '36px'	
			}
		},
		rangeSelector: {
			buttons: [
				{
					type: 'minute',
					count: 5,
					text: '5min'
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
				verticalAlign: 'top',
				floating: true,
				y: 240
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

	function initData(object){
		console.log("Loading...");

		$.each(channel.list, function (i, name) {
			
			var option = config;//{results : config.results, api_key : params.api_key}
				var fetch_url = serverURL+params.channelID+'/field/'+name+'.json?'+$.param(option)+'&start='+getDatepicker[0]+'&end='+getDatepicker[1];
				var gogo = "https://data.learninginventions.org/channels/"+params.channelID+"/field/1.json?results=&dynamic=true&"+'&start='+getDatepicker[0]+'&end='+getDatepicker[1]
		
		

			$.getJSON(fetch_url,    function (data) {

				var list = []
				var datamonth = []
				var parsedData
				var g=0;
				if (data.feeds){
					$.each(data.feeds, function (index, record) {
						if(record[fieldTxt+name]){
							parsedData = parseDataLog({ datetime:record.created_at,value:record[fieldTxt+name] });
							list.push( [parsedData.datetime, parsedData.value ] )
							valueplot[i] = parsedData.value.toFixed(2);
							
						}
					});
					
				}

				
				// Store last upadted
				channel.data[name].last_entry_id = data.channel.last_entry_id
				channel.data[name].updated_at = data.channel.updated_at;
				channel.updated_at = data.channel.updated_at;
				isLoading[name] =  false;

				seriesOptions[i] = {
					name: channel.data[name].name,
					data: list,
					type: ( validTypes.indexOf(channel.data[name].type) > -1  ? channel.data[name].type : 'line' ),
					step: channel.data[name].type=="step" ? 'left' : false ,
					tooltip: {valueSuffix: " " + suffix[i]}
				};

				// As we're loading the data asynchronously, we don't know what order it will arrive. So
				// we keep a counter and create the chart when all the data is loaded.
				seriesCounter += 1;

				if (seriesCounter === channel.names.length) {
					createChart();
					plotRealTime(valueplot);
				}

			});
		});
	
		return  
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
	
function convertTime(x,data){
		var datePicker = data.toISOString();
		var str1 = datePicker.split("T");
		var str2 = str1[1].split(".");
		getDatepicker[x] = str1[0]+"%20"+str2[0];
		return getDatepicker[x];

	}
	
function getTimedate() {

    var start = moment().subtract(30, 'days');
    var end = moment();
    
    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' to ' + end.format('MMMM D, YYYY'));
        convertTime(0,start._d);
        convertTime(1,end._d);
        
        channelKey = 0;
        params = getUrlParameter();
    	validateParams();
    	//Fetch channel information
    	//getChannelInfo(updateChannelShow);
    	//for (var i = 0; i <= 20; i++) {
    	//	break;
    	//if(room4rdFloor[i][0] == params.roomID)  {
    	//	continue;
    	//	console.log('start')
    	//	console.log(room4rdFloor[i],params.roomID)
    	//	console.log(getDataValue(start._d,end._d,101+Number(room4rdFloor[i][1])))
    	//	getDataValue(start._d,end._d,101+Number(room4rdFloor[i][1]))
    		

    	//} 
  //  }
    		
    	for (var i = 0; i <= 20; i++) {
    		if(room4rdFloor[i][0] != params.roomID){continue;}
    		for (var j = 1;j<=10; j++) { 
    			if(!room4rdFloor[i][j]){continue;}
    			//saveData[i][j] = getDataValue(start._d,end._d,102+room4rdFloor[i][j]);
    			console.log('start')
    			console.log(room4rdFloor[i],params.roomID,i,j,channelKey)
    			getDataValue(start._d,end._d,101+Number(room4rdFloor[i][j]))
    			channelKey++
    			//getDataValue(start._d,end._d,101+Number(room4rdFloor[i][j]))
    		};
    		
    		createChart();
    		document.getElementById("RoomIdHtml").innerHTML = params.roomID;
    	};
    	


    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
   

    }, cb);

    cb(start, end);  

}

function convert(date) {
	YY = 1900+date.getYear()
	MM = 1+date.getMonth()
	DD = date.getDate()
	selectDate = YY+ "-" + MM + "-" + DD
	return selectDate
	
}
function getDataValue (startDate,endDate,channelID){
	
	var fetch_url = serverURL+channelID+'/field/'+1+'.json?&start='+ convert(startDate)+'&end='+ convert(endDate) + "%2023%3A59%3A59" + "&timezone=Asia/Bangkok"
	
	nameOfSeries = String(channelID-101)
	var parsedData
	list = [];


	$.ajax({
  url: fetch_url,
  dataType: 'json',
  async: false,
  
  success: function(data) {
    	console.log(data.feeds)	

   
					
		for (var index in data.feeds){
			var record = data.feeds[index]
			//console.log(channelID,record)
			
			
			parsedData = parseDataLog({ datetime:record.created_at,value:record.field1});
			//console.log(parsedData)
			list.push( [parsedData.datetime, parsedData.value ] )
			//valueplot[i] = parsedData.value.toFixed(2);
			
			

		
		
		
	
}
	seriesOptions[channelKey] ={
				name : nameOfSeries,
				data : list

			}
	
  }
});


return list
	
}




	function handleLoaded(series){

		if (!config.dynamic) {
			return;
		}

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



