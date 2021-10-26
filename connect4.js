module.exports = class Connect4 {
    constructor() {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.history = { '-1': { inputs: [], outputs: [] }, '1': { inputs: [], outputs: [] } }
        this.nextPlayer = -1;
        this.turnsTaken = 0;
        this.onOver = new Promise((resolve, reject) => {
            this.onOverResolve = resolve;
            this.onOverReject = resolve;
        });
    }

    static possibleWins = [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [7, 8, 9, 10], [8, 9, 10, 11], [9, 10, 11, 12], [10, 11, 12, 13], [14, 15, 16, 17], [15, 16, 17, 18], [16, 17, 18, 19], [17, 18, 19, 20], [21, 22, 23, 24], [22, 23, 24, 25], [23, 24, 25, 26], [24, 25, 26, 27], [28, 29, 30, 31], [29, 30, 31, 32], [30, 31, 32, 33], [31, 32, 33, 34], [35, 36, 37, 38], [36, 37, 38, 39], [37, 38, 39, 40], [38, 39, 40, 41], [0, 7, 14, 21], [7, 14, 21, 28], [14, 21, 28, 35], [1, 8, 15, 22], [8, 15, 22, 29], [15, 22, 29, 36], [2, 9, 16, 23], [9, 16, 23, 30], [16, 23, 30, 37], [3, 10, 17, 24], [10, 17, 24, 31], [17, 24, 31, 38], [4, 11, 18, 25], [11, 18, 25, 32], [18, 25, 32, 39], [5, 12, 19, 26], [12, 19, 26, 33], [19, 26, 33, 40], [6, 13, 20, 27], [13, 20, 27, 34], [20, 27, 34, 41], [0, 8, 16, 24], [7, 15, 23, 31], [14, 22, 30, 38], [1, 9, 17, 25], [8, 16, 24, 32], [15, 23, 31, 39], [2, 10, 18, 26], [9, 17, 25, 33], [16, 24, 32, 40], [3, 11, 19, 27], [10, 18, 26, 34], [17, 25, 33, 41], [3, 9, 15, 21], [10, 16, 22, 28], [17, 23, 29, 35], [4, 10, 16, 22], [11, 17, 23, 29], [18, 24, 30, 36], [5, 11, 17, 23], [12, 18, 24, 30], [19, 25, 31, 37], [6, 12, 18, 24], [13, 19, 25, 31], [20, 26, 32, 38]];
    static columns = [[35, 28, 21, 14, 7, 0], [36, 29, 22, 15, 8, 1], [37, 30, 23, 16, 9, 2], [38, 31, 24, 17, 10, 3], [39, 32, 25, 18, 11, 4], [40, 33, 26, 19, 12, 5], [41, 34, 27, 20, 13, 6]]

    get moves() {
        let moves = [];
        for (let i = 0; i < 7; i++) {
            moves[i] = this.board[i] === 0;
        }
        return moves;
    }
    get boardRows() {
        let chunked = []
        for (let i = 0, j = this.board.length; i < j; i += 7) {
            chunked.push(this.board.slice(i, i + 7));
        }
        return chunked;
    }
    get isOver() {
        return this.winner !== undefined;
    }
    get isTie() {
        return this.winner === 0;
    }
    get winnerHistory() {
        let winner = this.winner
        if (winner === undefined || winner === 0) return [];
        return this.history[winner];
    }

    detectWinner() {
        if (this.turnsTaken < 7) return;
        for (let i = 0; i < Connect4.possibleWins.length; i++) {
            let player = this.board[Connect4.possibleWins[i][0]]
            if (player !== 0 && player === this.board[Connect4.possibleWins[i][1]] && player === this.board[Connect4.possibleWins[i][2]] && player === this.board[Connect4.possibleWins[i][3]]) {
                return player;
            }
        }
        if (this.turnsTaken === 42) return 0;
        return;
    }
    move(column, logic) {

        if (!this.moves[column]) return -1;

        for (let i = 0; i < 6; i++) {
            if (this.board[Connect4.columns[column][i]] === 0) {

                let outputs = [0, 0, 0, 0, 0, 0, 0];
                outputs[column] = 1;
                if (logic) {
                    this.history[this.nextPlayer].inputs.push([...this.board, this.nextPlayer])
                } else {
                    this.history[this.nextPlayer].inputs.push([...this.board])
                }
                this.history[this.nextPlayer].outputs.push(outputs)

                this.board[Connect4.columns[column][i]] = this.nextPlayer;
                this.turnsTaken++;
                this.nextPlayer = -this.nextPlayer;

                this.winner = this.detectWinner();
                if (this.winner !== undefined) this.onOverResolve(this);

                return this;
            }
        }
    }
    checkForWin(player, location) {
        if (this.turnsTaken < 5) return false;
        for (let i = 0; i < Connect4.possibleWins.length; i++) {
            if (Connect4.possibleWins[i].includes(location)) {
                let p = [...Connect4.possibleWins[i]];
                const index = p.indexOf(location);
                if (index > -1) {
                    p.splice(index, 1);
                }
                if(this.board[location] === 0 && this.board[p[0]] === player && this.board[p[1]] === player && this.board[p[2]] === player) {
                    return true;
                }
            }
        }
        return false;
    }
    moveAuto(outputs, logic) {

        if (logic) {

            // basic Connect 4 logic

            let options = [];
            for (let i = 0; i < 7; i++) {
                if (this.moves[i]) {
                    for (let j = 0; j < 6; j++) {
                        if (this.board[Connect4.columns[i][j]] === 0) {
                            options.push({
                                location: Connect4.columns[i][j],
                                column: i,
                                isTop: j === 5
                            });
                            break;
                        }
                    }
                }
            }
            if (options.length === 1) {
                return this.move(options[0].column, true);
            }
            
            // 1st, check for spots with immediate win
            for (let i = 0; i < options.length; i++) {
                if (this.checkForWin(this.nextPlayer, options[i].location)) {
                    return this.move(options[i].column, true);
                }
            }

            // 2nd, check for spots to block immediate win
            for (let i = 0; i < options.length; i++) {
                if (this.checkForWin(-this.nextPlayer, options[i].location)) {
                    return this.move(options[i].column, true);
                }
            }

            // 3rd, don't go in spots where the other player wins above
            for (let i = 0; i < options.length; i++) {
                if (!options[i].isTop && this.checkForWin(-this.nextPlayer, options[i].location - 7)) {
                    outputs[options[i].column] = 0;
                }
            }

            // choose spot
            let sum = 0;
            for (let i = 0; i < 7; i++) {
                outputs[i] *= (+ this.moves[i]);
                sum += outputs[i];
                outputs[i] = sum;
            }
            if (sum === 0) {
                return this.move(options[0].column, true);
            }
            let r = Math.random() * sum;
            for (let i = 0; i < 7; i++) {
                if (r <= outputs[i]) {
                    return this.move(i, true);
                }
            }
            return this.move(3, true);

        } else {
            let sum = 0;
            for (let i = 0; i < 7; i++) {
                outputs[i] *= (+ this.moves[i]);
                sum += outputs[i];
                outputs[i] = sum;
            }
            let r = Math.random() * sum;
            for (let i = 0; i < 7; i++) {
                if (r <= outputs[i]) {
                    return this.move(i);
                }
            }
            return this.move(3);
        }
    }
    moveAutoBest(outputs, logic) {

        function indexOfMax(arr) {
            if (arr.length === 0) {
                return -1;
            }
        
            var max = arr[0];
            var maxIndex = 0;
        
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] > max) {
                    maxIndex = i;
                    max = arr[i];
                }
            }
        
            return maxIndex;
        }
        
        if (logic) {

            console.log(outputs)
            // basic Connect 4 logic

            let options = [];
            for (let i = 0; i < 7; i++) {
                if (this.moves[i]) {
                    for (let j = 0; j < 6; j++) {
                        if (this.board[Connect4.columns[i][j]] === 0) {
                            options.push({
                                location: Connect4.columns[i][j],
                                row: 5 - j,
                                column: i,
                                isTop: j === 5
                            });
                            break;
                        }
                    }
                }
            }
            console.log(options)
            if (options.length === 1) {
                console.log('one option')
                return this.move(options[0].column, true);
            }
            
            // 1st, check for spots with immediate win
            for (let i = 0; i < options.length; i++) {
                if (this.checkForWin(this.nextPlayer, options[i].location)) {
                    console.log('immediate win')
                    return this.move(options[i].column, true);
                }
            }

            // 2nd, check for spots to block immediate win
            for (let i = 0; i < options.length; i++) {
                if (this.checkForWin(-this.nextPlayer, options[i].location)) {
                    console.log('block win')
                    return this.move(options[i].column, true);
                }
            }

            // 3rd, don't go in spots where the other player wins above
            for (let i = 0; i < options.length; i++) {
                if (!options[i].isTop && this.checkForWin(-this.nextPlayer, options[i].location - 7)) {
                    console.log('avoiding column', i)
                    outputs[options[i].column] = 0;
                }
            }

            // choose spot
            let sum = 0;
            for (let i = 0; i < 7; i++) {
                outputs[i] *= (+ this.moves[i]);
                sum += outputs[i];
            }
            if (sum === 0) {
                console.log('no good options')
                return this.move(options[0].column, true);
            }
            console.log('model')
            return this.move(indexOfMax(outputs), true);

        } else {
            let sum = 0;
            for (let i = 0; i < 7; i++) {
                outputs[i] *= (+ this.moves[i]);
                sum += outputs[i];
            }
            return this.move(indexOfMax(outputs))
        }
    }
    reset() {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.history = { '-1': { inputs: [], outputs: [] }, '1': { inputs: [], outputs: [] } }
        this.nextPlayer = -1;
        this.turnsTaken = 0;
        this.winner = undefined;
        return this;
    }
    log() {
        function toSymbol(num) {
            if (num === -1) return 'O';
            if (num === 0) return ' ';
            if (num === 1) return 'X';
        }
        console.log('Winner:', toSymbol(this.winner))
        console.log('Next up:', toSymbol(this.nextPlayer))
        console.log('Turns:', this.turnsTaken)
        console.log('Board:')
        let rows = this.boardRows;
        let str = '';
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                str += '|' + toSymbol(rows[i][j])
            }
            str += '|\n';
        }
        str += ' 0 1 2 3 4 5 6 '
        console.log(str);
    }
};