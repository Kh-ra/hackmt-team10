
$(document).ready(function() {
	/*
		Latex Formatting
	*/
	var expr = document.getElementById('function_input'),
      pretty = document.getElementById('latex'),
      result = document.getElementById('history');

 expr.oninput = function () {
     var node = null;

     try {
     // parse the expression
     node = (expr.value == '') ? math.parse('0') : math.parse(expr.value);

     // export the expression to LaTeX
     var latex = node ? node.toTex({parenthesis: 'keep', implicit: 'hide'}) : '';

     // display and re-render the expression
     var elem = MathJax.Hub.getAllJax('pretty')[1];
     MathJax.Hub.Queue(['Text', elem, latex]);
   }
   catch (err) {}
 };

	// Hide input till latex loads
	setTimeout(function () {
		$('#loading').hide();
		$('#main_input').show();
	}, 500);

	// // Add function to history
	function addToHistory(latex, text) {
		$('<div class="func-history">'+latex+'<div class="func-history-ctrl">'+
			'<a href="#" class="func-history-delete"><i class="fa fa-trash" aria-hidden="true"></i></a>'+
			'<a href="#" class="func-history-copy"><i class="fa fa-clipboard" aria-hidden="true"></i></a></div></div>')
			.data('text', text).appendTo('#history');
		//My edit: Scroll to bottom
		var element = document.getElementById("history");
        element.scrollTop = element.scrollHeight;
	}

    //Click plot button
	$('#submit_btn').click(function() {
		if ($('function_input').val() != '') {
			addToHistory($('#latex').html(), expr.value);
		}
	});

	$('#history').on('click', '.func-history', function (e) {
		e.preventDefault();

		if (!$('e.target').hasClass('fa')) {
			$('.func-history').removeClass('selected');
			$(this).addClass('selected');
		}
	});

	$('#history').on('click', '.func-history-copy', function(e) {
		e.preventDefault();

		$('#function_input').val($(this).parent().parent().data('text'));
		expr.oninput();
	});

	$('#history').on('click', '.func-history-delete', function(e) {
		e.preventDefault();

		$(this).parent().parent().remove();
	});

	// Charts.js
	/*var ctx = document.getElementById("chart").getContext('2d');
	var chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'line',

	    // The data for our dataset
	    data: {
	        labels: ["January", "February", "March", "April", "May", "June", "July"],
	        datasets: [{
	            label: "My First dataset",
	            backgroundColor: 'rgb(255, 99, 132)',
	            borderColor: 'rgb(255, 99, 132)',
	            data: [0, 10, 5, 2, 20, 30, 45],
	        }]
	    },

	    // Configuration options go here
	    options: {}
	});*/

    //GRAPH
	var mathbox = mathBox({
      plugins: ['core', 'controls', 'cursor', 'mathbox'],
      controls: {
        // Orbit controls, i.e. Euler angles, with gimbal lock
        klass: THREE.OrbitControls,

        // Trackball controls, i.e. Free quaternion rotation
        //klass: THREE.TrackballControls,
      },
    });
    if (mathbox.fallback) throw "WebGL not supported"

    var three = mathbox.three;
    three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);



    // Do stuff with mathbox,
    // for example: (see docs/intro.md)


    // Place camera
    var camera =
      mathbox
      .camera({
        proxy: true,
        position: [0, 0, 2],
      });
    // 2D cartesian
    var view =
      mathbox
      .cartesian({
        range: [[-2, 2], [-1, 1]],
        scale: [2,1],
      });

    // Axes + grid
    view
      .axis({
        axis: 1,
        width: 3,
      })
      .axis({
        axis: 2,
        width: 3,
      })
      .grid({
        width: 2,  
        divideX: 20,
        divideY: 10,        
      });

    // Make axes black
    mathbox.select('axis').set('color', 'black');

    // Calibrate focus distance for units
    mathbox.set('focus', 1);

    // Add some data
    var data =
      view
      .interval({
        expr: function (emit, x, t) {
          emit(Math.cos(x), Math.sin(x));
        },
        width: 150,
        channels: 2,
      });
    
    // Draw a curve
    var curve =
      view
      .line({
        width: 5,
        color: '#3090FF',
      });

    // Draw some points
    var points =
      view
      .point({
        size: 8,
        color: '#3090FF',
      });

    // Draw ticks and labels
    var scale =
      view.scale({
        divide: 10,
      });
    
    var ticks =
      view.ticks({
        width: 5,
        size: 15,
        color: 'black',
      });
    
    var format =
      view.format({
        digits: 2,
        weight: 'bold',
      });

    var labels =
      view.label({
        color: 'red',
        zIndex: 1,
      });
          
    var osc = new Tone.Oscillator({
	"frequency" : 261.63,
	"volume" : 0.05
    }).toMaster();

    var n =0;
    var t =100;

    osc.start();
    setInterval(chgTone((n+=(t/1000), t);

	
    function onoff(){
    if(osc.state() == "started")
    	osc.stop();
    else
	osc.start();
    }

    function chgTone(double y){
       osc.frequency.value = 261.63*Math.pow(2, y/12);

    }
	
    osc.start();
	
  /*  // Animate
    var play = mathbox.play({
      target: 'cartesian',
      pace: 5,
      to: 2,
      loop: true,
      script: [
        {props: {range: [[-2, 2], [-1, 1]]}},
        {props: {range: [[-4, 4], [-2, 2]]}},
        {props: {range: [[-2, 2], [-1, 1]]}},
      ]
    });*/

    
	$('canvas').detach().appendTo('.chart-container');
	$('.mathbox-overlays').detach().appendTo('.chart-container');

});
