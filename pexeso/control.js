// javascript to control the game
$(document).ready(function() {
	// setup dimensions
	var H = $(window).height();
	var W = $(window).width();
	// elements
	var container = $('#pexeso_container');

	// keywords
	var keywords = ['besný kamzík', 'divný pes', 'oni sa len hrajú', 'zelený luck', 'počkáme, kým podochádza', 'trnavské mýto', 'stôl u kubistu', 'shepherd walking', 'morning mad drop', 'pohárik na plôtiku', 'I dont know what Im doing', 'jančuška mančuška pančuška'];
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
		$('.piece.opened').text("m&m").addClass('closed').removeClass('opened');
	}

	// click function
	function clickPiece(element) {

		// check if the piece isn't out of the game already
		var isDone = $(element).hasClass('found');
		if (isDone) return false;
		// check if the piece is turned
		var key = $(element).attr('data-back');
		var isClosed = $(element).hasClass('closed');
		var index = parseInt($(element).attr('data-index'));
		console.log(key);
		if (isClosed) {
			nClicks += 1;
			$(element).removeClass('closed');
			$(element).addClass('opened');
			$(element).text(key);
			var order = gameState[key][0] == index ? 0 : 2;
			gameState[key][order+1] = 1;
			console.log(gameState[key]);
			if (gameState[key][1] + gameState[key][3] == 2) {
				// found!
				console.log(gameState[key] )
				$($('.piece')[gameState[key][0]]).removeClass('opened').addClass('found');
				$($('.piece')[gameState[key][2]]).removeClass('opened').addClass('found');
				// $('.piece[data-index="' + key + '"]').addClass('found').removeClass('opened');
				// check if all aren't found
				nClicks = 0;
			} else if (nClicks == 2) {
				resetBoard();
				timeout = window.setTimeout(closePieces, 1500);
				// add some animation
				nClicks = 0;
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
		var pieceString = "<div class='piece closed' data-back='" + key + "' data-index='" + j + "'>m&m</div>";
		container.append(pieceString);
		// it holds key of this piece plus wheter it is deemed found or not
		if (gameState[key] === undefined) {
			gameState[key] = [j, 0, null, 0];
		} else {
			gameState[key][2] = j;
		}
	}
	console.log(gameState);
	$('.piece').click(function(){
		clickPiece($(this));
	});




});

