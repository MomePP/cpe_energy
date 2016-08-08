var serverURL = "https://data.learninginventions.org/channels/";
var config = { results:1000, dynamic:false };
var fieldTxt = "field";
var params  = {};
var channel = {fields:[],names:[],data:{}};

var isLoading = {};
var seriesOptions = [],
seriesCounter = 0,

createChart = function () {
	var channelID = Number(getUrlParameter("channelID"));
	 $('#container').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: channel.name
        },
        subtitle: {
            text: 'Energy Usage Per Months'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: seriesOptions
    });
};

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
        if ( !Number(datas.channelID) || Number(datas.channelID)<1 ) {
            alert("Invalid Channel ID");
            return false;
        } else if ( datas.api_key && datas.api_key.length != 16 ) {
            alert("Invalid Read API Key");
            return false;
        }

        if (!"api_key" in datas){
            datas.api_key = "";
        }

        if ("results" in datas && Number(datas.results) ){
            config.results = Number(datas.results);
        }
        if ("days" in datas && Number(datas.days) ){
            config.days = Number(datas.days);
            delete config.results;
        }

        config.dynamic = ("dynamic" in datas && datas.dynamic=='true');

        return true;
    }

function getChannelInfo(callback){
        $.getJSON( serverURL+params.channelID+"/feeds.json?results=0&api_key="+params.api_key, callback).fail(function() {
            alert("Invalid parametors");
        });

    }

var updateChannelShow = function(data){
        channel = $.extend(channel, data.channel);
        //window.alert(suffix[1]);
        setFields(data);
        initData(data);
    }
