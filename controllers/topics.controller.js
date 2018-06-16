const fs = require('fs');
const path = require('path');
// NOTE: This lets you link your files relative to current file and not have it be dependant from where you were on your machine when you ran the server
const dictFile = path.join(__dirname,'../data/dict.txt')
// path.join(__dirname, '/Users/evanhendrix1/programming/code/codingChallenges/t9-kiwi-challenge/t9-server')
// use this convention for naming your controller

// module.exports = {
//
// }

let gT = {};

  gT.dictionary = '';
  gT.dictionaryTree = {};
  gT.words = [];
  gT.keyMap = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz'
  };


function Word(word, occurrences) {
    this.word = word;
    this.occurrences = occurrences;
}

Word.prototype.toString = function () {
    return this.word + ' (' + this.occurrences + ')';
};

/**
 * Function to build the arbol. Called once
 * @param  {string} dictionary string of words from parsed dict
 * @return {null}            [description]
 */
function buildTree (dictionary) {
    // console.log(`initializing dictionary. 'dictionary' = `, dictionary);
    gT.dictionary = dictionary
    gT.words = dictionary.split(/\s+/g);

    var tree = {}; // internal tree variable object

    // https://github.com/jrolfs/javascript-trie-predict/blob/master/predict.js
    gT.words.forEach(function (word) {
        // 'letters' is an array of letters
        var letters = word.split('');
        var leaf = tree;

        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i].toLowerCase();
            var existing = leaf[letter];
            var last = (i === letters.length - 1);

            // If child leaf doesn't exist, create it
            if (typeof(existing) === 'undefined') {
                // If we're at the end of the word, mark with number, don't create a leaf
                leaf = leaf[letter] = last ? 1 : {};

            // If final leaf exists already
            } else if (typeof(existing) === 'number') {
                // Increment end mark number, to account for duplicates
                if (last) {
                    leaf[letter]++;

                // Otherwise, if we need to continue, create leaf object with '$' marker
                } else {
                    leaf = leaf[letter] = { $: existing };
                }

            // If we're at the end of the word and at a leaf object with an
            // end '$' marker, increment the marker to account for duplicates
            } else if (typeof(existing) === 'object' && last) {
                if (existing.hasOwnProperty('$')) {
                    leaf[letter].$++;
                } else {
                    leaf[letter] = existing;
                    leaf[letter].$ = 1;
                }

            // Just keep going (here we're reassigning the 'leaf' to be the next letter of the very leaf we're on)
            } else {
                leaf = leaf[letter];
            }
        }

    });

    gT.dictionaryTree = tree;

/**
 * [predict description]
 * @param  {integer} numericInput    user input digits
 * @return {array}         array of all possible inteded words
 */
gT.predict = (numericInput) => {
        // console.log(`gT.predict called!!`);
        // console.log(`predict 'numericInput' = `, numericInput);
        var input = new String(numericInput);
        // console.log(`predict 'input' =  `, input);
        var results = gT.findWords(numericInput, gT.dictionaryTree, true);
        return results;
    };

/**
 * find possible words based on input digits
 * @param  {string}  sequence    input digits
 * @param  {object}  tree        tree or node
 * @param  {boolean} exact     exact matches or not
 * @param  {array}   words       current array of possible intented words
 * @param  {string}   currentWord [description]
 * @param  {integer}   depth       [description]
 * @return {array}            array of all possible intended words
 */
gT.findWords = (sequence, tree, exact, words, currentWord, depth) => {
    console.log(`\n\ngT.findWords() called!`);

    var current = tree;
    console.log(`current =`, current);

    sequence = sequence.toString();
    words = words || [];
    currentWord = currentWord || '';
    depth = depth || 0;

    // Check each leaf on this level
    for (var leaf in current) {
        var word = currentWord;
        var value = current[leaf];
        var key;

        // If the leaf key is '$' handle things one level off since we
        // ignore the '$' marker when digging into the tree
        if (leaf === '$') {
            key = sequence.charAt(depth - 1);
            if (depth >= sequence.length) {
                words.push(word);
            }
        } else {
            key = sequence.charAt(depth);
            word += leaf;
            if (depth >= (sequence.length - 1) && typeof(value) === 'number' && key && (gT.keyMap[key].indexOf(leaf) > -1)) {
                words.push(word);
            }
        }

        // If the leaf's value maps to our key or we're still tracing
        // the prefix to the end of the tree (`exact` is falsy), then
        // "we must go deeper"...

        if ((key && gT.keyMap.hasOwnProperty(key) && gT.keyMap[key].indexOf(leaf) > -1) || (!key && !exact)) {
            gT.findWords(sequence, value, exact, words, word, depth + 1);
        }
    }

      // Yeah, not as cool when not returning the recursive function call
      // returns, but we gotta just rely on JS references since we may be
      // going more than one way down the tree and we don't want to be
      // breaking the leaf loop
      return words;
};
// console.log('gT = ', gT);

};


// Start here
const wordsString = fs.readFileSync(dictFile, 'utf-8');
buildTree(wordsString);

exports.predictWord = (req, res) => {
  // res.setHeader("Content-Type", "text/html");
  // console.log('req = ', req, '.   res = ', res);
  console.log(`req.params.numString = `, req.params.numString);
  let wordSuggestionArray = gT.predict(req.params.numString);
  console.log(`wordSuggestionArray =`, wordSuggestionArray);
  res.json(wordSuggestionArray);
}
