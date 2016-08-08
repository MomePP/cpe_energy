var serverURL = "https://data.learninginventions.org/channels/";

var config = { results:1000, dynamic:false };

var fieldTxt = "field";
var param	= {};
var channelID = "133" 
var channels = {fields:[],names:[],data:{}};
var listData = {room:[],ac:[],value:{}}
var getDatepicker=[];
var room4rdFloor = {"R1":["401","30","31","28"],
            "R2":["402","1","3","5"],
            "R3":["403","4"],
            "R4":["404","2"],
            "R5":["405","6"],
            "R6":["406","7","9"],
            "R7":["407","11"],
            "R8":["409","8"],
            "R9":["410","10"],
            "R10":["411(4th)","13","15"],
            "R11":["411","0"],
            "R12":["412(4th)","20"],
            "R13":["412(1)","16"],
            "R14":["412(2)","14"],
            "R15":["412(N)","34"],
            "R16":["413","21","23"],
            "R17":["413(Gra)","19","24"],
            "R18":["LIL","25","29"],
            "R19":["414(3rd)","22","29"],
            "R20":["SIPA","32"],
            "R21":["422","33"],
            };

function toList(){
	var buf={};
	var current={room:[],ac:[],value:{}}
	for (var i = 1; i <= 21; i++) {
		buf = room4rdFloor["R"+i]
		current.room = buf[0]
		current.ac = buf[1]
		current.value = buf[2]
		console.log(current)
		
	};
	console.log(room4rdFloor.R20[1])
	getData("32");
	console.log("======")

	
}

function writeData(data) {
	//document.getElementById("Alldata").innerHTML = listData;
}

function getData (ac) {
	channelID = Number(ac) + 101;
	getTimedate()
	param = "https://data.learninginventions.org/channels/"+channelID+"/field/1.json?results=&dynamic=true&"+'&start='+getDatepicker[0]+'&end='+getDatepicker[1];
	console.log(param)
	console.log(getDatepicker)
	
	
}

function getChannelInfo(callback){
		$.getJSON("https://data.learninginventions.org/channels/"+channelID+"/field/1.json?results=&dynamic=true&"+'&start='+getDatepicker[0]+'&end='+getDatepicker[1];, callback).fail(function() {
			alert("Invalid parametors");
		});

	}

var updateChannelShow = function(data){
		channel = $.extend(channel, data.channel);
		setFields(data);
		feedData(data);
	}

function setFields(object){

		//changes params
		params.types = decodeURIComponent(params.types).split(',');
		if (params.fields){
			params.fields = decodeURIComponent(params.fields).split(',');
		}
		console.log(params.fields);

		channel.list = [];
		var fieldIndex = 0;
		if (object.channel){
			for (var i=1 ; i<=8 && fieldTxt+i in object.channel ; i++){

				if ( ( params.fields && params.fields.indexOf(fieldTxt+i)>-1) || !params.fields){
					channel.data[i] = {
						i			:	i,
						field	: fieldTxt+i,
						label	: object.channel[fieldTxt+i],
						name	: fieldTxt+i+ ':' +  object.channel[fieldTxt+i],
						type 	: ( fieldIndex in params.types ? params.types[fieldIndex] : '' )
					}

					channel.fields.push(fieldTxt+i);
					channel.list.push(i);
					channel.names.push( fieldTxt+i+ ':' +  object.channel[fieldTxt+i]);
					fieldIndex++;
				}

			}
		}
	}

function feedData(object){
	
	
		console.log("Loading...");
		$.each(channel.list, function (i, name) {
			console.log(channel.list);
			var option = config;//{results : config.results, api_key : params.api_key}
			var fetch_url = "https://data.learninginventions.org/channels/"+"133"+"/field/1.json?results=&dynamic=true&"+'&start='+getDatepicker[0]+'&end='+getDatepicker[1];
			console.log(fetch_url)
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
							g++
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
					
				}

			});
		});
	
		return ;
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
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        convertTime(0,start._d);
        convertTime(1,end._d);
        command = "You pick datetime between " + start.format('D MMMM YYYY') + " to " + end.format('D MMMM YYYY');
        document.getElementById("command").innerHTML = command;
    	//Fetch channel information
    	alert(command)
    	getChannelInfo(updateChannelShow);
    	
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
        }

    }, cb);

    cb(start, end);  

}