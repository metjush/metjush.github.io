// javascript to control the game
$(document).ready(function() {
	// setup dimensions
	var H = $(window).height();
	var W = $(window).width();
	// elements
	var container = $('#pexeso_container');

	// keywords
	var keywords = ['besný kamzík', 'divný pes', 'oni sa len hrajú', 'zelená náhoda', 'počkáme, kým podochádza', 'trnavské mýto', 'stôl u kubistu', 'shepherd walking', 'morning mad drop', 'pohárik na plôtiku', 'I dont know what Im doing', 'jančuška mančuška pančuška'];

	var backside = 'm&m';

	// count number of necessary pieces and draw them based on H and W
	var pieceCount = keywords.length * 2;

	function resetBoard() {
		Object.keys(gameState).forEach(function (key) {
			gameState[key][1] = 0;
			gameState[key][3] = 0;
		});
		return true;
	}

	function closePieces() {
		$('.piece.opened').text(backside).addClass('closed').removeClass('opened');
	}

	function countFound() {
		if ($('.found').length == $('.piece').length) {
			// puzzle won!
			console.log('WINNER');
			// hide all pieces
			$('.found').hide();
			$('#victory').show();
		}
	}

	// click function
	function clickPiece(element) {
		if (nClicks == 0) {
			window.clearTimeout(timeout);
			closePieces();
		}
		
		// check if the piece isn't out of the game already
		var isDone = $(element).hasClass('found');
		if (isDone) return false;
		// check if the piece is turned
		var key = $(element).attr('data-back');
		var isClosed = $(element).hasClass('closed');
		var index = parseInt($(element).attr('data-index'));
		if (isClosed) {
			nClicks += 1;
			$(element).removeClass('closed');
			$(element).addClass('opened');
			$(element).html(key);
			var order = gameState[key][0] == index ? 0 : 2;
			gameState[key][order+1] = 1;
			if (gameState[key][1] + gameState[key][3] == 2) {
				// found!
				$($('.piece')[gameState[key][0]]).removeClass('opened').addClass('found');
				$($('.piece')[gameState[key][2]]).removeClass('opened').addClass('found');				
				nClicks = 0;
				// check if all aren't found
				countFound();
			} else if (nClicks == 2) {
				resetBoard();
				nClicks = 0;
				timeout = window.setTimeout(closePieces, 800);
				// add some animation
			}
		}
	}
	
	// distribute the pieces
	var doubleKeys = keywords.concat(keywords); // double the number of pieces
	var gameState = {};
	var nClicks = 0;
	var timeout;
	for (var j = 0; j < pieceCount; j++) {
		// randomly picked keyword
		var index = Math.floor(Math.random()*doubleKeys.length);
		var key = doubleKeys[index];
		// remove it from the array
		doubleKeys.splice(index, 1);
		var pieceString = "<div class='piece closed' data-back='" + key + "' data-index='" + j + "'>" + backside + "</div>";
		container.append(pieceString);
		// it holds key of this piece plus wheter it is deemed found or not
		if (gameState[key] === undefined) {
			gameState[key] = [j, 0, null, 0];
		} else {
			gameState[key][2] = j;
		}
	}
	
	$('.piece').click(function(){
		clickPiece($(this));
	});




});

