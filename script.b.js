var serverURL = "https://data.learninginventions.org/channels/";
var getDatepicker=[];
var valueplot = [];
var unitUsedAllInRoom =[[],[]];

var saveData = [];
var numAir = [];
var roomValue = [];
var room4rdFloor = [["401","30","31","28"],
            ["402","1","3","5"],
            ["403","4"],
            ["404","2"],
            ["405","6"],
            ["406","7","9"],
            ["407","11"],
            ["409","8"],
           ["410","10"],
            ["411(4th)","13","15"],
            ["411","12"],
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
createChart2 =  function () {
    
    $('#container').highcharts({
        chart: {
            type: 'bar'
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
                align: "middle",
                enabled: "middle",
                margin: 40,
                offset: undefined,
                style: { "fontSize": "22px", "fontWeight": "bold" },
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
        series: [roomValue]
    });
}

function convertTime(data){
        date = moment(data).format('YYYY-MM-DD HH:mm:ss')
        return date;

    }
    
function getTimedate() {

    start = moment().subtract(30, 'days');
    end = moment();
    document.getElementById("container").innerHTML = "Please wait a moment";
    cb(start, end);  
   
}

function cb(start, end) {

        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' to ' + end.format('MMMM D, YYYY'));
        console.log(moment(start).format('YYYY-MM-DD HH:mm:ss'))
        console.log(moment(end).format('YYYY-MM-DD HH:mm:ss'))
        
        
        //Fetch channel information
        unitUsedAllInRoom[0] = []
        unitUsedAllInRoom[1] = []
        saveData = []
        var sumValue=0;
        // return;
        for (var i = 0; i <= 21; i++) {
            saveData.push(new Array());
            unitUsedAllInRoom[0].push(room4rdFloor[i][0])
            for (var j = 1;j<=10; j++) { 
                if(!room4rdFloor[i][j]){continue;}
                
                lastValue = getLastValue(end._d,101+Number(room4rdFloor[i][j]))
                firstValue = getFirstValue(start._d,101+Number(room4rdFloor[i][j]))
                saveData[i].push(lastValue - firstValue)
                sumValue += (lastValue - firstValue)
                
                
            };
            roomValue.push({
                    room:   room4rdFloor[i][0],
                    value: sumValue
                    });
            console.log(saveData)
            console.log(roomValue)
            sumValue = 0;
        
        };
        roomValueSorted = _.sortBy(roomValue, 'room');
        console.log(roomValueSorted)
        createChart2()
        document.getElementById("timePicker").innerHTML = end;
        
       

    }


$(function() {
    $('#reportrange').daterangepicker({
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        timePicker: true,
        timePicker24Hour: true,
   

    }, cb);
});



function getLastValue (endDate,channelID){
    
    var fetch_url = serverURL+channelID+'/field/'+1+'.json?&results=1&end='+ convertTime(endDate)+ "&timezone=Asia/Bangkok"
    var resultsWh ;
    console.log(fetch_url);
    $.ajax({
  url: fetch_url,
  dataType: 'json',
  async: false,
  
  success: function(data) {
    
        
        var record = data.feeds
        console.log(channelID,record[0])
        if (record[0]){
            resultsWh = record[0].field1
        }
        else{
        console.log("NoData")
        
    }
    
  }
});
return resultsWh
    
}

function getFirstValue (endDate,channelID){
    
    var fetch_url = serverURL+channelID+'/field/'+1+'.json?&results=1&end='+ convertTime(endDate)
    var resultsWh ;
    console.log(fetch_url);
    $.ajax({
  url: fetch_url,
  dataType: 'json',
  async: false,
  
  success: function(data) {
    
        
        var record = data.feeds
        console.log(channelID,record[0])
        if (record[0]){
            resultsWh = record[0].field1
        }
        else{
        console.log("NoData")
        
    }
    
  }
});
return resultsWh
    
}
