(function (container) {
    const whitePlayer = -1,
        blackPlayer = 1,
        whiteFigures = 3,
        blackFigures = 3;

    let tableW = 8,
        tableH = 8,
        table = new Array(tableH),
        currentPlayer = whitePlayer,
        selectedFigureX = -1,
        selectedFigureY = -1;

    function createUI() {
        for (let i = 0; i < tableH; i++) {
            table[i] = new Array(tableW);
            for (let j = 0; j < tableW; j++) {
                table[i][j] = 0;

                let cell = document.createElement('div');
                cell.setAttribute('cellY', i);
                cell.setAttribute('cellX', j);
                cell.className = 'block';
                cell.style.width = (container.offsetWidth / tableW - 2) + 'px';
                cell.style.backgroundColor = (i % 2) ^ (j % 2) == 0 ? 'gray' : 'white'; //i % 2 == 0 ? (j % 2 == 0 ? 'gray' : 'white') : (j % 2 == 0 ? 'white' : 'gray');

                cell.addEventListener('click', e => {
                    let el = e.target,
                        cell = el.classList.contains('block') ? el : el.parentNode,
                        posY = cell.getAttribute('cellY'),
                        posX = cell.getAttribute('cellX');

                    if (table[posY][posX] != 0) {
                        selectFigure(posX, posY);
                    } else if (selectedFigureX != -1) {
                        if (moveFigure(selectedFigureX, selectedFigureY, posX, posY)) {
                            currentPlayer = currentPlayer == whitePlayer ? blackPlayer : whitePlayer;
                            resetState();
                        }
                    }

                });

                container.append(cell);
            }
        }
    }

    createUI();

    function addFigure(x, y, player) {
        table[y][x] = player;
        let figure = document.createElement('div');
        figure.className = 'figure';
        figure.style.backgroundColor = player == whitePlayer ? 'white' : 'black';
        container.querySelector(`div[cellY='${y}'][cellX='${x}']`).append(figure);
    }

    function removeFigure(x, y) {
        table[y][x] = 0;
        container.querySelector(`div[cellY='${y}'][cellX='${x}']`).innerHTML = '';
    }

    function moveFigure(x, y, newX, newY) {
        let figurePlayer = table[y][x];
        if (figurePlayer != 0 && table[newY][newX] == 0) {
            if ((x != newX && y != newY) ||
                (x != newX && Math.abs(x - newX) > 1) ||
                (y != newY && Math.abs(y - newY) > 1)) {
                return;
            }

            removeFigure(x, y);
            addFigure(newX, newY, figurePlayer);
            return true;
        }
    }

    function resetState() {
        if (selectedFigureY != -1) {
            let el = container.querySelector(`div[cellY='${selectedFigureY}'][cellX='${selectedFigureX}'] > div`);
            if (el) {
                el.removeAttribute('selected');
            }
            selectedFigureX = -1;
            selectedFigureY = -1;
        }
    }

    function selectFigure(x, y) {
        if (table[y][x] != currentPlayer) {
            return;
        }
        resetState();
        selectedFigureX = x;
        selectedFigureY = y;
        container.querySelector(`div[cellY='${y}'][cellX='${x}'] > div`).setAttribute('selected', null);

    }

    for (let y = 0; y < blackFigures; y++) {
        for (let x = 0; x < blackFigures; x++) {
            addFigure(x, y, blackPlayer);
        }
    }

    for (let y = tableH - whiteFigures; y < tableH; y++) {
        for (let x = tableW - whiteFigures; x < tableW; x++) {
            addFigure(x, y, whitePlayer);
        }
    }
})(document.getElementById('container'));