module.exports = function solveSudoku(matrix) {
	  Sudoku = function(matrix) {
        var solved = [];
        var first = 0;

        init(matrix);
        solve();

        function init(matrix) {
            first = 0;
            var number = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for ( var i=0; i<9; i++) {
                solved[i] = [];
                for ( var j=0; j<9; j++ ) {
                    if ( matrix[i][j] ) {
                        solved[i][j] = [matrix[i][j], 'in', []];
                    }
                    else {
                        solved[i][j] = [0, 'undefined', number];
                    }
                }
            }
        };

        function changeSuggests() {
            var changed = 0;
            var buf = arrayDec(solved[1][3][2], rowContent(1));
            buf = arrayDec(buf, colContent(3));
            buf = arrayDec(buf, sectContent(1, 3));
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++) {
                    if ( 'undefined' != solved[i][j][1] ) {
                        continue;
                    }

                    changed += solveSingle(i, j);

                    changed += solveHiddenSingle(i, j);
                }
            }
            return changed;
        };


        function solveSingle(i, j) {
            solved[i][j][2] = arrayDec(solved[i][j][2], rowContent(i));
            solved[i][j][2] = arrayDec(solved[i][j][2], colContent(j));
            solved[i][j][2] = arrayDec(solved[i][j][2], sectContent(i, j));
            if ( 1 == solved[i][j][2].length ) {

                marking(i, j, solved[i][j][2][0]);
                return 1;
            }
            return 0;
        };


        function solveHiddenSingle(i, j) {
            var less_suggest = lessRowSuggest(i, j);
            var changed = 0;
            if ( 1 == less_suggest.length ) {
                marking(i, j, less_suggest[0]);
                changed++;
            }
            var less_suggest = lessColSuggest(i, j);
            if ( 1 == less_suggest.length ) {
                marking(i, j, less_suggest[0]);
                changed++;
            }
            var less_suggest = lessSectSuggest(i, j);
            if ( 1 == less_suggest.length ) {
                marking(i, j, less_suggest[0]);
                changed++;
            }
            return changed;
        };


        function marking(i, j, solve) {
            solved[i][j][0] = solve;
            solved[i][j][1] = 'solved';
        };


        function rowContent(i) {
            var content = [];
            for ( var j=0; j<9; j++ ) {
                if ( 'undefined' != solved[i][j][1] ) {
                    content[content.length] = solved[i][j][0];
                }
            }
            return content;
        };


        function colContent(j) {
            var content = [];
            for ( var i=0; i<9; i++ ) {
                if ( 'undefined' != solved[i][j][1] ) {
                    content[content.length] = solved[i][j][0];
                }
            }
            return content;
        };


        function sectContent(i, j) {
            var content = [];
            var offset = sectOffset(i, j);
            for ( var k=0; k<3; k++ ) {
                for ( var l=0; l<3; l++ ) {
                    if ( 'undefined' != solved[offset.i+k][offset.j+l][1] ) {
                        content[content.length] = solved[offset.i+k][offset.j+l][0];
                    }
                }
            }
            return content;
        };


        function lessRowSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            for ( var k=0; k<9; k++ ) {
                if ( k == j || 'undefined' != solved[i][k][1] ) {
                    continue;
                }
                less_suggest = arrayDec(less_suggest, solved[i][k][2]);
            }
            return less_suggest;
        };


        function lessColSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            for ( var k=0; k<9; k++ ) {
                if ( k == i || 'undefined' != solved[k][j][1] ) {
                    continue;
                }
                less_suggest = arrayDec(less_suggest, solved[k][j][2]);
            }
            return less_suggest;
        };


        function lessSectSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            var offset = sectOffset(i, j);
            for ( var k=0; k<3; k++ ) {
                for ( var l=0; l<3; l++ ) {
                    if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'undefined' != solved[offset.i+k][offset.j+l][1] ) {
                        continue;
                    }
                    less_suggest = arrayDec(less_suggest, solved[offset.i+k][offset.j+l][2]);
                }
            }
            return less_suggest;
        };


        function arrayDec (ar1, ar2) {
            var arr_dec = [];
            for ( var i=0; i<ar1.length; i++ ) {
                var is_found = false;
                for ( var j=0; j<ar2.length; j++ ) {
                    if ( ar1[i] == ar2[j] ) {
                        is_found = true;
                        break;
                    }
                }
                if ( !is_found ) {
                    arr_dec[arr_dec.length] = ar1[i];
                }
            }
            return arr_dec;
        };

        function sectOffset(i, j) {
            return {
                j: Math.floor(j/3)*3,
                i: Math.floor(i/3)*3
            };
        };

        function theSolved() {
            var theSolved = true;
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++ ) {
                    if ( 'undefined' == solved[i][j][1] ) {
                        theSolved = false;
                    }
                }
            }
            return theSolved;
        };


        this.theSolved = function() {
            return theSolved();
        };


        function isFailed() {
            var is_failed = false;
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++ ) {
                    if ( 'undefined' == solved[i][j][1] && !solved[i][j][2].length ) {
                        is_failed = true;
                    }
                }
            }
            return is_failed;
        };

        function solve() {
            var changed = 0;
            do {
                changed = changeSuggests();
                first++;
                if ( 81 < first ) {
                    break;
                }
            } while (changed);

            if ( !theSolved() && !isFailed() ) {
                backtracking();
            }
        };
        function backtracking() {
            var matrix = [[], [], [], [], [], [], [], [], []];
            var i_min=-1, j_min=-1, suggests_cnt=0;
            for ( var i=0; i<9; i++ ) {
                matrix[i].length = 9;
                for ( var j=0; j<9; j++ ) {
                    matrix[i][j] = solved[i][j][0];
                    if ( 'undefined' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
                        suggests_cnt = solved[i][j][2].length;
                        i_min = i;
                        j_min = j;
                    }
                }
            }


            for ( var k=0; k<suggests_cnt; k++ ) {
                matrix[i_min][j_min] = solved[i_min][j_min][2][k];

                var sudoku = new Sudoku(matrix);
                if ( sudoku.theSolved() ) {

                    out_val = sudoku.solved();

                    for ( var i=0; i<9; i++ ) {
                        for ( var j=0; j<9; j++ ) {
                            if ( 'undefined' == solved[i][j][1] ) {
                                marking(i, j, out_val[i][j][0])
                            }
                        }
                    }
                    return;
                }
            }
        };


        this.solved = function() {
            return solved;
        };
    };

    return new Sudoku(matrix).solved()
        .map(row => row.map(cell => cell[0]));
};
