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

	// Add function to history
	function addToHistory(latex, text) {
		$('<div class="func-history">'+latex+'<div class="func-history-ctrl">'+
			'<a href="#" class="func-history-delete"><i class="fa fa-trash" aria-hidden="true"></i></a>'+
			'<a href="#" class="func-history-copy"><i class="fa fa-clipboard" aria-hidden="true"></i></a></div></div>')
			.data('text', text).appendTo('#history');
	}

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
});