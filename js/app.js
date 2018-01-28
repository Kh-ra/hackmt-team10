$(document).ready(function() {
  var code = null;
  $('#function_input').val('');
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
     code = math.compile(expr.value);
     // export the expression to LaTeX
     var latex = node ? node.toTex({parenthesis: 'keep', implicit: 'hide'}) : '';

     // display and re-render the expression
     var elem = MathJax.Hub.getAllJax('pretty')[1];
     MathJax.Hub.Queue(['Text', elem, latex]);
   }
   catch (err) {}
 };
 expr.oninput();

	// Hide input till latex loads
	setTimeout(function () {
		$('#loading').hide();
		$('#main_input').show();
	}, 500);

	// // Add function to history
	function addToHistory(latex, text, start, end) {
		$('<div class="func-history"><div class="func-history-latext">'+latex+'</div><div class="func-history-range">'+
      '<span class="func-history-start">'+start+'</span><span class="func-history-range-label"><= x <=</span>'+
      '<span class="func-history-end">'+end+'</span></div><div class="func-history-ctrl">'+
			'<a href="#" class="func-history-delete"><i class="fa fa-trash" aria-hidden="true"></i></a>'+
			'<a href="#" class="func-history-copy"><i class="fa fa-copy" aria-hidden="true"></i></a></div></div>')
			.data('text', text).appendTo('#history');
		//My edit: Scroll to bottom
		var element = document.getElementById("history");
        element.scrollTop = element.scrollHeight;
	}

    //Click plot button
	$('#submit_btn').click(function() {
		if ($('function_input').val() != '') {
			addToHistory($('#latex').html(), expr.value, $('#start_input').val(), $('#end_input').val());
		}
	});

	$('#history').on('click', '.func-history-copy', function(e) {
		e.preventDefault();

		$('#function_input').val($(this).parent().parent().data('text'));
    $('#start_input').val($(this).parent().parent().find('.func-history-start').html());
    $('#end_input').val($(this).parent().parent().find('.func-history-end').html());
		expr.oninput();
	});

	$('#history').on('click', '.func-history-delete', function(e) {
		e.preventDefault();

		$(this).parent().parent().remove();
	});

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
        proxy: false,
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
          emit(x, code.eval({x : x}));
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
    	"volume" : .05
      }).toMaster();

    var n =0;
    var t =50;
    var interval;
    $('#play_btn').click(function() {
        $('#active_playback_ctrls').css('display', 'flex');
        $(this).css('display', 'none');
        osc.start();
        interval = setInterval(function () {
            n+=(t/1000);
            osc.frequency.value = 261.63*Math.pow(2, code.eval({x : n})/12);
        }, t);
    });

    $('#stop_btn').click(function() {
        $('#play_btn').css('display', 'block');
        $('#active_playback_ctrls').css('display', 'none');
        clearInterval(interval);
        osc.stop();
        n = 0;
    });

    $('#pause_btn').click(function() {
        $('#play_btn').css('display', 'block');
        $('#active_playback_ctrls').css('display', 'none');
        clearInterval(interval);
        osc.stop();
    });

  	$('canvas').detach().appendTo('.chart-container');
  	$('.mathbox-overlays').detach().appendTo('.chart-container');

});
