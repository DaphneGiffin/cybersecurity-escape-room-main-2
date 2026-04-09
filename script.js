// EDIT THIS LINE TO CHANGE THE AMOUNT OF TIME
totalNumMinutes = 20;

// EDIT THIS ARRAY TO ADD OR CHANGE VIDEOS
// THE CODES MUST BE ENTERED IN THIS ORDER
allCodes = [
    {
        code: '{INITIAL}',
        url: ''
     },
    {
        code: 'BOTNET',
        url: 'https://drive.google.com/file/d/1JB_2sTj7maF67xRHnSeDzppUQvNOM3-0/preview'
    },
    {
        code: 'SECURITY QUESTIONS',
        url: 'https://drive.google.com/file/d/1dIzqh1nsvPiKixqPLTz1mn9bPp3qAjzE/preview'
    },
    {
        code: 'BRUTE FORCE',
        aliases: ['BRUTE-FORCE', 'BRUTEFORCE', 'BRUTE FORCING', 'BRUTE-FORCING', 'BRUTEFORCING'],
        url: 'https://drive.google.com/file/d/188zrr7viBEiEkJGjG8IO7qWIVDb9ye6L/preview'
    },
    {
        code: 'STEGANOGRAPHY',
        url: 'https://drive.google.com/file/d/1nRq5JMEDLRKMPFiQQuEHiEsBmwQGH48p/preview'
    },
    {
        code: 'OPEN SOURCE INTELLIGENCE',
        url: 'https://drive.google.com/file/d/1LMGrKO1_7PLk343Q03yVkedy5Pa3Axuv/preview'
    },
    {
        code: 'PHISHING ATTACK',
        aliases: ['PHISHING'],
        url: 'https://drive.google.com/file/d/1GoL9Vit6sDVsYt0mX3mdeDWvtWbUGRtx/preview'
    },
    {
        code: 'RANSOMWARE',
        url: 'https://drive.google.com/file/d/19g3ol5N_fDSnkpE9CA_lTg4r1j_zb6Un/preview'
    },
    {
        code: '0BF63C462A3297F3A2AED67682CA11CB',
        url: 'https://drive.google.com/file/d/1SRzWeqkgERokEP8Ceo-n15gT-NPYypXn/preview'
    },
    {
        code: 'SENDCASH',
        url: 'https://drive.google.com/file/d/1liYWX-xXLjbCDWN-jSJD_pl5duLIm5pY/preview'
    },
    {
        code: '{WIN}',
        url: 'https://drive.google.com/file/d/1mQy3iUnNngl39hR6asIDxf-_mEEHmTC1/preview'
    },
    {
        code: '{LOSS}',
        url: 'https://drive.google.com/file/d/1TVOf3W0zP3gTjri2GvbWCVBKcZsy6hbL/preview'
    },
]

// DON'T EDIT ANYTHING BELOW HERE
currentVideo = document.getElementById("current-video");
allSavedCodes = ['{INITIAL}'];
endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
gameState = 'menu';
teamName = '';
clockShown = true;
defeatReason = 'unset';
numOfCodesEntered = 1;

function getIndexOfCode(code) {
    for (let i = 0; i < allCodes.length; i++) {
        if (allCodes[i].code === code) { return i; }
        if (allCodes[i].aliases && allCodes[i].aliases.includes(code)) { return i; }
    }
    return -1;
}

function getCurrentCorrectCode() {
    return allCodes[numOfCodesEntered].code;
}

function updateVideo(code) {

    // Only allow actions during play
    if (gameState !== 'play') {
        playSound('incorrect');
        return;
    }

    let index = getIndexOfCode(code);

    // If code doesn't exist
    if (index === -1) {
        playSound('incorrect');
        return;
    }

    // Handle LOSS manually
    if (code === '{LOSS}') {
        gameState = 'loss';
        clearInterval(x);
        playSound('loss');
        defeatReason = defeatReason === 'unset' ? 'out of time' : defeatReason;

        currentVideo.src = allCodes[index].url;

        document.getElementById('code-controls').style.display = 'none';
        document.getElementById('mission-controls').style.display = 'block';
        document.getElementById('hash-link').style.display = 'none';
        document.getElementById('clock').style.color = 'red';
        document.getElementById('clock').style.borderColor = 'red';
        return;
    }

    // Only allow the CURRENT correct code (or any aliases)
    const currentEntry = allCodes[numOfCodesEntered];
    const accepted = [currentEntry.code, ...(currentEntry.aliases || [])];
    if (!accepted.includes(code)) {
        playSound('incorrect');
        return;
    }

    // Move progression forward FIRST
    numOfCodesEntered++;

    document.getElementById('code-entry').value = '';

    playSound('correct');

    // If they just entered SENDCASH → WIN
    if (code === allCodes[9].code) {
        gameState = 'win';
        clearInterval(x);
        playSound('win');

        document.getElementById('code-controls').style.display = 'none';
        document.getElementById('mission-controls').style.display = 'block';
        document.getElementById('hash-link').style.display = 'none';
        document.getElementById('clock').style.color = 'yellow';
        document.getElementById('clock').style.borderColor = 'yellow';

        currentVideo.src = allCodes.find(c => c.code === '{WIN}').url;
        return;
    }

    // If they just entered FINDHASH → show hash link
    if (code === allCodes[8].code) {
        document.getElementById('hash-link').style.display = 'block';
    }

    // Play the NEXT video in sequence
    currentVideo.src = allCodes[numOfCodesEntered].url;
}

function currentCode() {
    if (document.getElementById("code-entry").value.toUpperCase() === getCurrentCorrectCode() && !allSavedCodes.includes(document.getElementById("code-entry").value.toUpperCase()) && document.getElementById("code-entry").value.toUpperCase() !== '{default}' && getIndexOfCode(document.getElementById("code-entry").value.toUpperCase()) !== -1) {
        allSavedCodes.push(document.getElementById("code-entry").value.toUpperCase());
        addVideoLink(document.getElementById("code-entry").value.toUpperCase());
    }
    return document.getElementById("code-entry").value.toUpperCase();
}

function goToCurrentVideo() {
    currentVideo.src = allCodes[numOfCodesEntered].url;
}

function replayVideo(code) {
    let index = getIndexOfCode(code);
    if (index !== -1) {
        currentVideo.src = allCodes[index].url;
    }
}

function addVideoLink(code) {
    addElement('button', code, 'saved-codes', [['class', 'saved-vid-link'], ['onclick', 'replayVideo("'+code+'")']]);
}

function addElement(tag, content, parent, attributes) {
	var newElement = document.createElement(tag);
	for (var attr = 0; attr < attributes.length; attr++)
	{
		newElement.setAttribute(attributes[attr][0], attributes[attr][1])
	}
	newElement.innerHTML = content;
	var parentElement = document.getElementById(parent);
	parentElement.appendChild(newElement);
}

function correctCode(video) {
    if (video === 'initial') {
        charString = allowedCodes[0];
    }
    if (video === 'puzzle2') {
        charString = allowedCodes[1];
    }
    if (video === 'q1') {
        charString = allowedCodes[2];
    }
    if (video === 'q2') {
        charString = allowedCodes[3];
    }
    if (video === 'q3') {
        charString = allowedCodes[4];
    }
    if (video === 'q4') {
        charString = allowedCodes[5];
    }
    if (video === 'q5') {
        charString = allowedCodes[6];
    }
    if (video === 'puzzle3') {
        charString = allowedCodes[7];
    }
    if (video === 'win') {
        charString = allowedCodes[8];
    }
    if (video === 'loss') {
        charString = allowedCodes[9];
    }
    correctSymbols = charString.split('-');
    result = '';
    for (let i = 0; i < correctSymbols.length; i++) {
        result += chars[parseInt(correctSymbols[i])];
    }
    return result;
}

function addDefault() {
}

function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
}

function startEscapeRoom() {
    if (document.getElementById("pwd-entry").value.toUpperCase() === 'STARTCYBER') {
        teamName = document.getElementById("name-entry").value;
        endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main').style.display = 'block';
        document.getElementById("clock").innerHTML = '40:00';
        gameState = 'play';
        currentVideo.src = allCodes[1].url;


    } else {
        alert('Incorrect password. Please ask the escape room guide for the correct password.');
    }
}

function playSound(sound) {
    if (sound === 'correct') {
        new Audio('sound-correct.wav').play();
    }
    if (sound === 'incorrect') {
        new Audio('sound-incorrect.wav').play();
    }
    if (sound === 'win') {
        new Audio('sound-win.wav').play();
    }
    if (sound === 'loss') {
        new Audio('sound-loss.wav').play();
    }
}

function showResultScreen() {
    var startNumSeconds = totalNumMinutes*60;
    var endTime = document.getElementById('clock').innerHTML.split(':');
    var endNumSeconds = parseInt(endTime[0])*60 + parseInt(endTime[1]);
    var totalSeconds = startNumSeconds - endNumSeconds;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    document.getElementById('team-text').innerHTML = 'Team: ' + teamName;
    if (gameState === 'win') {
        document.getElementById('time-text').innerHTML = 'Final Time: ' + padWithZero(minutes, 2) + ':' + padWithZero(seconds, 2);
    } else {
        document.getElementById('time-text').innerHTML = 'Defeat Reason: ' + defeatReason;
    }
    document.getElementById('result-screen').style.borderColor = gameState === 'win' ? 'lime' : 'red';
    document.getElementById('result-screen').style.color = gameState === 'win' ? 'lime' : 'red';
    document.getElementById('result-text').style.borderColor = gameState === 'win' ? 'lime' : 'red';
    document.getElementById('result-text').innerHTML = gameState === 'win' ? 'SUCCESS' : 'FAILURE';
    document.getElementById('main').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

function returnToMain() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('main').style.display = 'block';
}

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = endTime - now;
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("clock").innerHTML = padWithZero(minutes, 2) + ":" + padWithZero(seconds, 2);
  if (distance < 0 && gameState === 'play') {
    clearInterval(x);
    document.getElementById("clock").innerHTML = "00:00";
    defeatReason = 'out of time';
    updateVideo('{LOSS}');
  }
}, 500);

document.getElementById('code-entry').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('code-submit').click();
    }
});

document.getElementById('pwd-entry').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('login-button').click();
    }
});