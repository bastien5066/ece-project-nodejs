var simpleChart = null;
var IMCChart = null

function refreshChart(newMetrics) {
    setDataIMCChart(newMetrics)
    setDataSimpleChart(newMetrics)
}

function setDataIMCChart(metricsSent) {
    var dataChart = {
        dataHeightChart: [],
        dataWeightChart: []
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
        labelsChart.labelsChart.push(data.timestamp.replace('-', '/').replace('-', '/').split('~')[0])
        dataChart.dataHeightChart.push(data.height)
        dataChart.dataWeightChart.push(data.weight)
    });

    drawChart('#imc-chart', IMCChart, 'bar', labelsChart, dataChart, typeChart, settingsChart);
    $('#imc-chart').show();
}

function setDataSimpleChart(metricsSent) {
    var dataChart = {
        dataHeightChart: [],
        dataWeightChart: []
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
        labelsChart.labelsChart.push(data.timestamp.replace('-', '/').replace('-', '/').split('~')[0])
        dataChart.dataHeightChart.push(data.height)
        dataChart.dataWeightChart.push(data.weight)
    });

    drawChart('#simple-chart', simpleChart, 'bar', labelsChart, dataChart, typeChart, settingsChart);
    $('#simple-chart').show();
}


function drawChart(chartName, chartRef, type, labelsChart, dataChart, typeChart, settingsChart) {
    var data = {
        labels: labelsChart.labelsChart,
        datasets: [{
            label: labelsChart.labelsDataChart[0],
            type: typeChart[0],
            borderColor: settingsChart.colorChart[0],
            data: dataChart.dataHeightChart,
            fill: false
        }, {
            label: labelsChart.labelsDataChart[1],
            type: typeChart[0],
            borderColor: settingsChart.colorChart[1],
            data: dataChart.dataWeightChart,
            fill: false
        }, {
            label: labelsChart.labelsDataChart[0],
            type: typeChart[1],
            backgroundColor: settingsChart.colorChart[0],
            data: dataChart.dataHeightChart,
        }, {
            label: labelsChart.labelsDataChart[1],
            type: typeChart[1],
            backgroundColor: settingsChart.colorChart[1],
            data: dataChart.dataWeightChart
        }]
    };
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
}