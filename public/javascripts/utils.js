// Helper functions
function lineChart(chart, ctx, data, options, segmentClickfunc) {
  var chartData = data || {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderWidth: 1,
        data: [65, 59, 80, 81, 56, 55, 40],
      }
    ]
  };
  var chartOptions = options || {
    scales: {
      xAxes: [{
        stacked: false
      }],
      yAxes: [{
        stacked: false
      }]
    }
  };
  if (!chart) {
    var canvas = ctx.append('<canvas></canvas>').find('canvas');
    chart = new Chart(canvas.get(0).getContext("2d"), {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
    if (typeof segmentClickfunc === 'function') {
      $(ctx).find('canvas').on('click', function (event) { segmentClickfunc(chart, event) });
    }
  } else {
    chart.config.data = chartData;
    chart.update();
  }
  return chart;
}

function barChart(chart, ctx, data, options, segmentClickfunc) {
  var chartData = data || {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderWidth: 1,
        data: [65, 59, 80, 81, 56, 55, 40],
      }
    ]
  };
  var chartOptions = options || {
    scales: {
      xAxes: [{
        stacked: false
      }],
      yAxes: [{
        stacked: false
      }]
    }
  };
  if (!chart) {
    var canvas = ctx.append('<canvas></canvas>').find('canvas');
    chart = new Chart(canvas.get(0).getContext("2d"), {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
    if (typeof segmentClickfunc === 'function') {
      $(ctx).find('canvas').on('click', function (event) { segmentClickfunc(chart, event) });
    }
  } else {
    chart.config.data = chartData;
    chart.update();
  }
  return chart;
}

function doughnutChart(chart, ctx, data, options, segmentClickfunc) {
  var chartData = data || {
    labels: [
      "Red",
      "Blue",
      "Yellow"
    ],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56"
        ]
      }]
  };
  var chartOptions = options || {};
  if (!chart) {
    var canvas = ctx.append('<canvas></canvas>').find('canvas');
    chart = new Chart(canvas.get(0).getContext("2d"), {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });
    if (typeof segmentClickfunc === 'function') {
      $(ctx).find('canvas').on('click', function (event) { segmentClickfunc(chart, event) });
    }
  } else {
    chart.config.data = chartData;
    chart.update();
  }
  return chart;
}

function radarChart(chart, ctx, data, options, segmentClickfunc) {
  var chartData = data || {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [65, 59, 90, 81, 56, 55, 40]
      },
      {
        label: "My Second dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        pointBackgroundColor: "rgba(255,99,132,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255,99,132,1)",
        data: [28, 48, 40, 19, 96, 27, 100]
      }
    ]
  };
  var chartOptions = options || {};
  if (!chart) {
    var canvas = ctx.append('<canvas></canvas>').find('canvas');
    chart = new Chart(canvas.get(0).getContext("2d"), {
      type: 'radar',
      data: chartData,
      options: chartOptions
    });
    if (typeof segmentClickfunc === 'function') {
      $(ctx).find('canvas').on('click', function (event) { segmentClickfunc(chart, event) });
    }
  } else {
    chart.config.data = chartData;
    chart.update();
  }
  return chart;
}

function shadeColor(color, percent) {
  var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function rand255(){
  return Math.round(Math.random()*255)
}