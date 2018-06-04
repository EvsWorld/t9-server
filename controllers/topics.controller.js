const fs = require('fs');
const path = require('path');
// NOTE: This lets you link your files relative to current file and not have it be dependant from where you were on your machine when you ran the server
const dictFile = path.join(__dirname,'../data/dict.txt')
// path.join(__dirname, '/Users/evanhendrix1/programming/code/codingChallenges/t9-kiwi-challenge/t9-server')
// use this convention for naming your controller

// module.exports = {
//
// }
const t9 = {};

t9.dictionary = '';
t9.dictionaryTree = {};
t9.words = [];
// debugger;
t9.keyMap = {
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

// Function to build the arbol. This is called once
function buildTree (wordsArray) {
    // console.log(`initializing dictionary. 'dictionary' = `, dictionary);

    var tree = {}; // internal tree variable object

    // https://github.com/jrolfs/javascript-trie-predict/blob/master/predict.js
    wordsArray.forEach(function (word) {
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

            // Just keep going
            } else {
                leaf = leaf[letter];
            }
        }

    });

    t9.dictionaryTree = tree;

};

t9.predict = function(numericInput) {
        var input = new String(numericInput);
        var results = t9.findWords(numericInput, t9.dictionaryTree, true);

        return results;
    };

t9.findWords = function(sequence, tree, exact, words, currentWord, depth) {

    var current = tree;

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
            if (depth >= (sequence.length - 1) && typeof(value) === 'number' && key && (t9.keyMap[key].indexOf(leaf) > -1)) {
                words.push(word);
            }
        }

        // If the leaf's value maps to our key or we're still tracing
        // the prefix to the end of the tree (`exact` is falsy), then
        // "we must go deeper"...

        if ((key && t9.keyMap.hasOwnProperty(key) && t9.keyMap[key].indexOf(leaf) > -1) || (!key && !exact)) {
            t9.findWords(sequence, value, exact, words, word, depth + 1);
        }
    }

      // Yeah, not as cool when not returning the recursive function call
      // returns, but we gotta just rely on JS references since we may be
      // going more than one way down the tree and we don't want to be
      // breaking the leaf loop
      return words;
};

// Start here
// const input = fs.createReadStream('../data/dictionary.txt');
// readLines(input, func);
const wordsString = fs.readFileSync(dictFile, 'utf-8');
wordsArrayInput = wordsString.split(/\s+/g);
// console.log(`input is of type: `, typeof input);
buildTree(wordsArrayInput);
// console.log(`t9 = `, t9);

exports.listTopics = (req,res) => {
  Topic.find() // find is method of mongoose
  .then((topics) => {
    console.log(topics);
    //insted of res.send, we are sending json data
    res.json(topics);
  });
}

exports.addTopic = (req,res) => {
  if(!req.body) return res.status(400).json({  // json sends
    error: 'no body sent'
  });
  Topic.create({
    title: req.body.title,
  })
  .then(topic => {
    res.json(topic);
  })
}

// we started with this shit:
// exports.listTopics = (req,res) => {
//   res.send('GET /topics')};
// exports.addTopic = (req,res) => {
//   res.send('POST /topics')};
// exports.deleteTopic = (req,res) => {
//   res.send('DELETE /topics/:id')};
// exports.voteUp = (req,res) => {
//   res.send('PUT /topics/:id')};
// exports.voteDown = (req,res) => {
//   res.send('PUT /topics/:id')};
