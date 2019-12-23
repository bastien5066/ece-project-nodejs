/* 
    chart.js : JS file which handle the displaying of graphs and their data
*/

//Function to refresh the chart with the new metrics that are received
function refreshChart(newMetrics, simpleChart, IMCChart) {
    return [setDataSimpleChart(newMetrics, simpleChart), setDataIMCChart(newMetrics, IMCChart)];
}

//Function to set the content of BMI chart
function setDataIMCChart(metricsSent, chartRef) {
    var dataChart = {
        firstData: [],
    }

    var labelsChart = {
        labelsChart: [],
        labelsDataChart: ["IMC"]
    }

    const typeChart = ["line", "bar"]

    const settingsChart = {
        colorChart: ["red", "blue"],
        titleDisplay: true,
        titleChart: "Evolution of your BMI (weight(kg)/height²(m)) through time",
        titleFontColor: "black",
        titleFontFamily: "Impact",
        titleFontSize: "18",

        legendDisplay: true,
        legendPosition: "bottom",
        legendLabel: {
            fontColor: "black",
            boxWidth: 20,
            padding: 20
        },
        yAxes: [{
            ticks: {
                min: 0
            }
        }]
    }
    var metrics = metricsSent
    metrics.forEach(function(data) {
        labelsChart.labelsChart.push(data.timestamp.replace('-', '/').replace('-', '/').split('~')[0] + " " + data.timestamp.split('~')[1])
        dataChart.firstData.push(data.weight / ((data.height / 100) * (data.height / 100)));
    });

    chart = drawChart('#imc-chart', chartRef, 'bar', labelsChart, dataChart, typeChart, settingsChart);
    $('#imc-chart').show();
    return chart;
}

//Function to set the content of the Height/Weight chart
function setDataSimpleChart(metricsSent, chartRef) {
    var dataChart = {
        firstData: [],
        secondData: []
    }

    var labelsChart = {
        labelsChart: [],
        labelsDataChart: ["Height", "Weight"]
    }

    const typeChart = ["line", "bar"]

    const settingsChart = {
        colorChart: ["red", "blue"],
        titleDisplay: true,
        titleChart: "Evolution of your height and weight through time",
        titleFontColor: "black",
        titleFontFamily: "Impact",
        titleFontSize: "18",

        legendDisplay: true,
        legendPosition: "bottom",
        legendLabel: {
            fontColor: "black",
            boxWidth: 20,
            padding: 20
        },
        yAxes: [{
            ticks: {
                min: 0
            }
        }]
    }
    var metrics = metricsSent
    metrics.forEach(function(data) {
        labelsChart.labelsChart.push(data.timestamp.replace('-', '/').replace('-', '/').split('~')[0] + " " + data.timestamp.split('~')[1])
        dataChart.firstData.push(data.height)
        dataChart.secondData.push(data.weight)
    });

    chart = drawChart('#simple-chart', chartRef, 'bar', labelsChart, dataChart, typeChart, settingsChart);
    $('#simple-chart').show();
    return chart;
}

//Function to draw the chart sent in parameter with his settings
function drawChart(chartName, chartRef, type, labelsChart, dataChart, typeChart, settingsChart) {
    if (dataChart.secondData != undefined) {
        var data = {
            labels: labelsChart.labelsChart,
            datasets: [{
                label: labelsChart.labelsDataChart[0],
                type: typeChart[0],
                borderColor: settingsChart.colorChart[0],
                data: dataChart.firstData,
                fill: false
            }, {
                label: labelsChart.labelsDataChart[1],
                type: typeChart[0],
                borderColor: settingsChart.colorChart[1],
                data: dataChart.secondData,
                fill: false
            }, {
                label: labelsChart.labelsDataChart[0],
                type: typeChart[1],
                backgroundColor: settingsChart.colorChart[0],
                data: dataChart.firstData,
            }, {
                label: labelsChart.labelsDataChart[1],
                type: typeChart[1],
                backgroundColor: settingsChart.colorChart[1],
                data: dataChart.secondData
            }]
        };
    } else {
        var data = {
            labels: labelsChart.labelsChart,
            datasets: [{
                    label: labelsChart.labelsDataChart[0],
                    type: typeChart[0],
                    borderColor: settingsChart.colorChart[0],
                    data: dataChart.firstData,
                    fill: false
                },
                {
                    label: labelsChart.labelsDataChart[0],
                    type: typeChart[1],
                    backgroundColor: settingsChart.colorChart[0],
                    data: dataChart.firstData,
                },
            ]
        };
    }
    var options = {
        responsive: true,
        title: {
            display: settingsChart.titleDisplay,
            text: settingsChart.titleChart,
            fontFamily: settingsChart.titleFontFamily,
            fontSize: settingsChart.titleFontSize,
            fontColor: settingsChart.titleFontColor
        },
        legend: {
            display: settingsChart.legendDisplay,
            position: settingsChart.legendPosition,
            labels: settingsChart.legendLabel
        },
        scales: {
            yAxes: settingsChart.yAxes
        },
    }
    var ctx = $(chartName);

    $(chartName).hide();
    if (chartRef != null) {
        chartRef.destroy();
    }
    chartRef = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });

    return chartRef;
}