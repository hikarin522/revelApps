// myscript.js

$(function() {
	var canvas = $('#mycanvas')[0];
	var ctx = canvas.getContext('2d');

	var n = 201;
	var lineData = {
		labels: [],
		datasets: [
			{
				label: "Sin Wave",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			},
			{
				label: "Cos Wave",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: []
			},
			{
				label: "Mix Wave",
				fillColor: "rgba(250,150,150,0.2)",
				strokeColor: "rgba(250,150,150,1)",
				pointColor: "rgba(250,150,150,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(250,150,150,1)",
				data: []
			}
		]
	};

	for (var i = 0; i < n; i++) {
		lineData.labels.push(i % 5 === 0 ? i : "");
		_.each(lineData.datasets, function(val) {
			val.data.push(0);
		});
	}

	var options = {
		animation: false,
		scaleOverride: true,
		scaleSteps: 100/5,
		// Number - The value jump in the hard coded scale
		scaleStepWidth: 5,
		// Number - The scale starting value
		scaleStartValue: 0,
		showTooltips: false,
		bezierCurve: false
	};

	var myLineChart = new Chart(ctx).Line(lineData, options);

	var socket = new WebSocket('ws://'+window.location.host+'/wscon');
	socket.onmessage = function(event) {
		var point = JSON.parse(event.data);

		_.each(myLineChart.datasets, function(val, i) {
			var tmp = val.points.shift();
			tmp.value = point[i];
			val.points.push(tmp);
		});

		myLineChart.update();
	};

	$('#timeform').on('submit', function() {
		var time = $('#msec').val();
		socket.send(time);
		return false;
	});
});
