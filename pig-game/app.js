/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice1 as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, dice, gameOn, maxScore;
var diceDOM;

function togglePlayer(){
    activePlayer = 1 - activePlayer;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    //document.querySelector('.player-0-panel').classList.remove('active');
    //document.querySelector('.player-1-panel').classList.add('active');
}

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    maxScore = parseInt(document.getElementById('max-score').value);
    if (isNaN(maxScore)) {
        maxScore = 100;
    }
    console.log(maxScore);

    document.querySelector('.dice1').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('#name-0').textContent = 'Player 1'
    document.querySelector('#name-1').textContent = 'Player 2'
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

    diceDOM = [document.querySelector('.dice1'), document.querySelector('.dice2')];
    
    document.querySelector('.btn-hold').disabled = false;
    document.querySelector('.btn-roll').disabled = false;
    
    document.querySelector('.tooltiptext').style.display = 'block';
    document.querySelector('.tooltiptext').innerHTML = "Roll dice to score " + maxScore + " points first.<br><br>Whenever you roll 1 the turn goes to another player and you lose all current round points.";
}

document.querySelector('.btn-roll').addEventListener('click', function() {
    document.querySelector('.tooltiptext').style.display = 'none';
    var dice = [Math.floor(Math.random() * 6 ) + 1, Math.floor(Math.random() * 6 ) + 1];
   
    diceDOM[0].style.display = 'block';
    diceDOM[1].style.display = 'block';
    diceDOM[0].src = 'dice-' + dice[0] + '.png';
    diceDOM[1].src = 'dice-' + dice[1] + '.png';
    
    
    if ((dice[0] !== 1) && (dice[1] !== 1)) {
        roundScore += dice[0] + dice[1];
        // document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + roundScore + '</em>';
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
        togglePlayer();
    }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
    if (roundScore === 0)
        return;
    scores[activePlayer] += roundScore;
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    if (scores[activePlayer] >= maxScore) {
        document.querySelector('#name-' + activePlayer).textContent = 'WINNER!'
        console.log('player ' + activePlayer + ' wins!');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        document.querySelector('.btn-hold').disabled = true;
        document.querySelector('.btn-roll').disabled = true;
    } else {
        togglePlayer();
    }
    roundScore = 0;
    document.querySelector('#current-' + activePlayer).textContent = '0';
});

document.querySelector('.btn-new').addEventListener('click', init);

init();