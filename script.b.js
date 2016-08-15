var serverURL = "https://data.learninginventions.org/channels/";
var getDatepicker=[];
var valueplot = [];
var unitUsedAllInRoom =[[],[]];

var saveData = [{"name":"sumAllUnit","value":"0"},{"name":"avgAllUnit","value":"0"}];
var roomValue = [];
var lastUpdate = 0;
var start = moment().subtract(30, 'days');
var end = moment();

var offsetChannel = 101;
var roomData = [{"name":"401","list":[{"no":30},{"no":31},{"no":28}],"sum_unit_used":0},{"name":"402","list":[{"no":1},{"no":3},{"no":5}],"sum_unit_used":0},{"name":"403","list":[{"no":4}],"sum_unit_used":0},{"name":"404","list":[{"no":2}],"sum_unit_used":0},{"name":"405","list":[{"no":6}],"sum_unit_used":0},{"name":"406","list":[{"no":7},{"no":9}],"sum_unit_used":0},{"name":"407","list":[{"no":11}],"sum_unit_used":0},{"name":"409","list":[{"no":8}],"sum_unit_used":0},{"name":"410","list":[{"no":10}],"sum_unit_used":0},{"name":"411(4th)","list":[{"no":13},{"no":15}],"sum_unit_used":0},{"name":"411","list":[{"no":12}],"sum_unit_used":0},{"name":"412(4th)","list":[{"no":20}],"sum_unit_used":0},{"name":"412(1)","list":[{"no":16}],"sum_unit_used":0},{"name":"412(2)","list":[{"no":14}],"sum_unit_used":0},{"name":"412(N)","list":[{"no":34}],"sum_unit_used":0},{"name":"413","list":[{"no":21},{"no":23}],"sum_unit_used":0},{"name":"413(Gra)","list":[{"no":19},{"no":24}],"sum_unit_used":0},{"name":"414","list":[{"no":26}],"sum_unit_used":0},{"name":"LIL","list":[{"no":25},{"no":29}],"sum_unit_used":0},{"name":"415(3rd)","list":[{"no":22},{"no":29}],"sum_unit_used":0},{"name":"SIPA","list":[{"no":32}],"sum_unit_used":0},{"name":"422","list":[{"no":33}],"sum_unit_used":0}];


createChart2 =  function () {
    
    $('#container').highcharts({
        chart: {
            type: 'bar',
            height: "800"
        },
         title: {
                text: null
            },
        xAxis: {
            categories: unitUsedAllInRoom[0],
            labels: {
                style: { "fontSize": "18px", "fontWeight": "bold" },
                formatter: function () {
                    return '<a href="'+"meter.html?&roomID=" + this.value + '"target="_blank">' + this.value + '</a>';
                    },
                    useHTML: true
                    },
            title: {
                text: null

            }
        },
        yAxis: {
            
            plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'white'
                }],
            min: 0,
            title: {
                text: 'Unit (KWh)',
                align: 'high',
                enabled: "middle",
                margin: 20,
                offset: undefined,
                style: { "fontSize": "18px", "fontWeight": "bold" },
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' KWh',
            style: {
                padding: 10,
                fontSize: "16px",
            },
            shared: true,
            useHTML: true,
            headerFormat: '<center><big>{point.key}</big><br/>',
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            footerFormat: '</center>',
            valueDecimals: 2
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                },
                series: {
                pointWidth: 40//width of the column bars irrespective of the chart size
            }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true,
            itemStyle: {
                color: '#000000',
                fontSize: "16px",
               
            }
        },
        credits: {
            enabled: false
        },
        series: [{name:'Unit',data:unitUsedAllInRoom[1]}]
    });
}

function convertTime(data){
        date = moment(data).format('YYYY-MM-DD HH:mm:ss')
        return date;

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
        
        fetchData({results : 1, end:moment(start).format('YYYY-MM-DD HH:mm:ss'), type:'unit_start'});
        fetchData({results : 1, end:moment(end).format('YYYY-MM-DD HH:mm:ss'), type:'unit_end'});

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
        setQueryParameters({start:start.format('YYYY-MM-DD HH:mm:ss'),end:end.format('YYYY-MM-DD HH:mm:ss')

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

function fetchData(option){
    console.log("Loading...");
    var roomCounter = 0;

    $.each(roomData, function(room_index, room){
            console.log(room);
            var sensorCounter = 0;
            $.each(room.list, function(sensor_index, sensor){

                option          = option || {results : 1};
                var channelID   = offsetChannel+sensor.no;
                var field       = option.field || 1;
                var fetch_url   = serverURL+channelID+'/field/'+field+'.json?'+$.param(option);
                room.sum_unit_used = 0;
                $.getJSON(fetch_url, function (data) {
                    
            
                    

                    sensor[option.type] = (data.feeds.length > 0 ) ? Number(data.feeds[0].field1) : 0;
                    if (option.type=='unit_end'){
                        sensor.unit_used = (sensor.unit_end >= sensor.unit_start ) ? (sensor.unit_end - sensor.unit_start):0;
                        room.sum_unit_used += sensor.unit_used;
                    }

                }).complete(function() { 
                    console.log("complete");
                    sensorCounter += 1;
                    if (sensorCounter === room.list.length) {
                        roomCounter += 1;
                        if (option.type=='unit_end' && roomCounter == roomData.length) {
                            // console.log(roomData);
                            startSort();
                        }
                        
                    } 
                });

                
            });

});

return;
}

function startSort(){

    var sorted = _.sortBy(roomData, function(room){ return -1*room.sum_unit_used; });
    unitUsedAllInRoom[0] = []
    unitUsedAllInRoom[1] = []
    for (room_index in sorted){
        var room = sorted[room_index];
        unitUsedAllInRoom[0].push(room.name);
        unitUsedAllInRoom[1].push(Number((room.sum_unit_used).toFixed(2)));
    }     
    calStatic()
    document.getElementById("lastTimeUpdate").innerHTML = end.format('YYYY-MM-DD HH:mm:ss');
    createChart2()
}
function calStatic() {
    sumValue = 0
    for (var i = 0 ; i <= unitUsedAllInRoom[1].length - 1; i++) {
      sumValue += unitUsedAllInRoom[1][i];
    };
    document.getElementById("Max.room").innerHTML = unitUsedAllInRoom[0][0];
    document.getElementById("Max.value").innerHTML = (unitUsedAllInRoom[1][0]).toFixed(2);
    document.getElementById("All.value").innerHTML = sumValue.toFixed(2) + "  (kW)" 
    document.getElementById("Avarage.value").innerHTML = (sumValue/unitUsedAllInRoom[1].length).toFixed(2)+ "  (kW)" ;
    
}
function parseDataLog(data){
        var date = new Date(data.datetime);
        var localdate = date-1*date.getTimezoneOffset()*60*1000;
        data.datetime = localdate;
        data.value    = Number(data.value);
        return data;
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
