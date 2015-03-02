// Atts: id, password, levels [1..*], cards [1..*], highscore
var db_user = new PouchDB('ANAR_USER');
// Atts: id, name, cards, numPieces, time, difficulty, imageName
// Functions: getPieces(), getCardsOnWin(), getPoints()
var db_level = new PouchDB('ANAR_LEVEL');
// Atts: id, name, image, description, number
var db_card = new PouchDB('ANAR_CARD2');

/*
 * User module
 */

function DBregisterUser(id, password, callback) {

    var user = {
        _id: id,
        password: password,
        highscore: 0,
        levels: ["0"],
        cards: []
    };

    db_user.put(user).then(function(result) {
        callback(null, user);

    }).catch(function(err) {
        callback(err.status, null);
    });
}

function DBloginUser(id, password, callback) {
    db_user.get(id).then(function(doc) {
        if (doc.password == password)
            callback(null, doc);
        else
            callback(401, null);

    }).catch(function(err) {
        callback(err.status, null);
    });
}

function DBGetHighscores(callback) {
        db_user.allDocs({
            include_docs: true
        }, function(err, response) {
            if (response) {
                response.rows.sort(function(a, b) {
                    if (a.doc.highscore < b.doc.highscore) return 1;
                    else if (a.doc.highscore > b.doc.highscore) return -1;
                    else return 0;
                });
            }
            callback(err, response);
        });
    }
    /*
     * End User module
     */

/*
 * Level module
 */

function getArray(low, high) {
    var arr = [];
    for (var i = low; i < high; ++i)
        arr.push(i);

    return arr;   
}

function DBCreateLevels() {
    var level = {};


    for (var i = 0; i < 30; i++) {
        if (i < 10)
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                cards: getArray(0, 10),
                numPieces: 10,
                time: '120',
                difficulty: 'Fácil',
                imageName: 'icon-128.png'
            };

        else if (i < 20)
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                cards: getArray(0, 20),
                numPieces: 20,
                time: '60',
                difficulty: 'Normal',
                imageName: 'icon-128.png'
            };
        else
            level = {
                _id: i.toString(),
                name: 'Nivel ' + i,
                cards: getArray(0, 30),
                numPieces: 30,
                time: '30',
                difficulty: 'Difícil',
                imageName: 'icon-128.png'
            };

        db_level.put(level);
    }
}


/* Gets the user levels. */
function DBGetUserLevels(user, callback) {
    db_level.allDocs({
        include_docs: true,
        keys: user.levels
    }, function(err, response) {
        callback(err, response);
    });
}

// TODO get total levels by category
function DBGetLevels(callback) {
    db_level.allDocs({
        include_docs: true
    }, function(err, response) {
        callback(err, response);
    });
}

/*
 * End Level module
 */

/*
 * Card module
 */

function DBCreateCards() {
    var card = {};

    for (var i = 0; i < 60; i++) {
        card = {
            _id: i.toString(),
            name: 'Carta ' + i,
            image: "images/icon-128.png",
            description: 'Lorem ipsum donor amet.',
            number: i
        };

        db_card.put(card);
    }
}

function DBGetUserCards(user, callback) {
    db_card.allDocs({
        include_docs: true,
        keys: user.cards
    }, function(err, response) {
        callback(err, response);
    });
};

function DBGetCards(callback) {
    db_card.allDocs({
        include_docs: true,
    }, function(err, response) {
        // Sorts the response according to the number attribute
        if (response) {
            response.rows.sort(function(a, b) {
                    if (a.doc.number > b.doc.number) return 1;
                    else if (a.doc.number < b.doc.number) return -1;
                    else return 0;
                });
        }
        callback(err, response);
    });
};

function BDGetLevelCards(level, callback) {

};

/*
 * End Card module
 */