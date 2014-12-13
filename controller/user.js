var express = require('express');
var router  = express.Router();
var db   = require('../models/db');


/* View a single user's information */

router.get('/InsertPlayer', function (req, res) {
	res.render('PlayerForm.ejs', {action: '/user/InsertPlayer' });
	});
	router.get('/InsertCompletePlayer', function (req, res) {
	res.render('CompletePlayerForm.ejs', {action: '/user/InsertCompletePlayer', PlayerID: req.query.PlayerID });
	});
router.get('/InsertLane', function (req, res) {
	res.render('LaneForm.ejs', {action: '/user/InsertLane', PlayerID: req.query.PlayerID } );
	});
router.get('/InsertPlayerLane', function (req, res) {
	res.render('PlayerLaneForm.ejs', {action: '/user/InsertPlayerLane', PlayerID: req.query.PlayerID  });
	});
router.get('/InsertScore', function (req, res) {
	res.render('ScoreForm.ejs', {action: '/user/InsertScore', PlayerID: req.query.PlayerID  });
	});
	router.get('/UpdateForm', function (req, res) {
            res.render('UpdateForm.ejs', {action: '/user/UpdatePlayerScore', PlayerID: req.query.PlayerID });
	});

router.get('/ViewOverallScore', function (req, res) {
	db.OverallScore(function (err, result) {
            if (err) throw err;
            res.render('displayOverall.ejs', {rs: result});
})});
router.get('/ViewStrikes', function (req, res) {
	db.Strikes(function (err, result) {
            if (err) throw err;
            res.render('displayStrikes.ejs', {rs: result});
})});
router.get('/ViewSpares', function (req, res) {
	db.Spares(function (err, result) {
            if (err) throw err;
            res.render('displaySpares.ejs', {rs: result});
})});
router.get('/ViewShoeRentalsMale', function (req, res) {
	db.ShoeRentalsMale(function (err, result) {
            if (err) throw err;
            res.render('displayRentals.ejs', {rs: result});
})});
router.get('/GutterBalls', function (req, res) {
	db.GutterBalls(function (err, result) {
            if (err) throw err;
            res.render('displayGutterBalls.ejs', {rs: result});
})});
router.get('/ViewPlayersinLane', function (req, res) {
	db.PlayersinLane(function (err, result) {
            if (err) throw err;
            res.render('displayPlayersinLane.ejs', {rs: result});
})});
router.get('/ViewDropDownLane', function (req, res) {
	db.GetPlayer(function (err, result) {
            if (err) throw err;
            res.render('displayDropDownLane.ejs', {rs: result});
            
})});
router.get('/ViewDropDownScore', function (req, res) {
	db.GetPlayer(function (err, result) {
            if (err) throw err;
            res.render('displayDropDownScore.ejs', {rs: result});
            
})});
router.get('/DropDownUpdate', function (req, res) {
	db.GetPlayer(function (err, result) {
            if (err) throw err;
            res.render('displayDropDownUpdate.ejs', {rs: result});
            
})});
router.get('/DropDownComplete', function (req, res) {
	db.GetPlayer(function (err, result) {
            if (err) throw err;
            res.render('displayDropDownComplete.ejs', {rs: result});
            
})});


router.get('/ViewSinglePlayer', function (req, res) {
	db.GetByID(req.body ,function (err, result) {
            if (err) throw err;
            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	PlayerID: req.body.PlayerID,
                	Name: req.body.Name,
		    		ShoeSize: req.body.ShoeSize,
                    GenderofShoe: req.body.GenderofShoe
                };
            res.render('displayPlayerInfo.ejs', placeHolderValues);
 			}
    });
});


// Save User to the Database
router.post('/UpdatePlayerScore', function (req, res) {
    db.EditScore( req.body, function (err, result) {
            if (err) throw err;

              if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	PlayerID: req.body.PlayerID,
					RoundNum: req.body.RoundNum,
                    Frame1Score: req.body.Frame1Score,
                    Frame2Score: req.body.Frame2Score,
                    GameNum: req.body.GameNum
                };
                res.render('displayScoreInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Player was not inserted.');
            }
        }
    );
});

router.post('/InsertPlayer', function (req, res) {
    db.InsertPlayer( req.body, function (err, result) {
            if (err) throw err;

            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	PlayerID: req.body.PlayerID,
                	Name: req.body.Name,
		    		ShoeSize: req.body.ShoeSize,
                    GenderofShoe: req.body.GenderofShoe
                };
                res.render('displayPlayerInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Player was not inserted.');
            }
        }
    );
});
router.post('/InsertCompletePlayer', function (req, res) {
		db.GetByID(req.body, function(err, result) {
		db.InsertLane( req.body, function (err, result) {
		db.InsertPlayerLane( req.body, function (err, result) {
		db.InsertScore1( req.body, function (err, result) {
		db.InsertScore2( req.body, function (err, result) {
		db.InsertScore3( req.body, function (err, result) {
		db.InsertScore4( req.body, function (err, result) {
		db.InsertScore5( req.body, function (err, result) {
		db.InsertScore6( req.body, function (err, result) {
		db.InsertScore7( req.body, function (err, result) {
		db.InsertScore8( req.body, function (err, result) {
		db.InsertScore9( req.body, function (err, result) {
		db.InsertScore10( req.body, function (err, result) {
		db.InsertScore11( req.body, function (err, result) {
            if (err) throw err;
            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
									PlayerID: req.body.PlayerID,
                					Name: req.body.Name,
									ShoeSize: req.body.ShoeSize,
                  					GenderofShoe: req.body.GenderofShoe,
									LaneNum: req.body.LaneNum,
									NumofPlayers: req.body.NumofPlayers, 
                  					CurrentRound: req.body.CurrentRound,
                  					GameNum: req.body.GameNum,
									RoundNum: req.body.NumofPlayers,
                  					Frame1Score1: req.body.Frame1Score1,
                  					Frame2Score1: req.body.Frame2Score1,
									Frame1Score2: req.body.Frame1Score2,
                  					Frame2Score2: req.body.Frame2Score2,
									Frame1Score3: req.body.Frame1Score3,
                  					Frame2Score3: req.body.Frame2Score3,
									Frame1Score4: req.body.Frame1Score4,
                  					Frame2Score4: req.body.Frame2Score4,
									Frame1Score5: req.body.Frame1Score5,
                  					Frame2Score5: req.body.Frame2Score5,
									Frame1Score6: req.body.Frame1Score6,
                  					Frame2Score6: req.body.Frame2Score6,
									Frame1Score7: req.body.Frame1Score7,
                  					Frame2Score7: req.body.Frame2Score7,
									Frame1Score8: req.body.Frame1Score8,
                  					Frame2Score8: req.body.Frame2Score8,
									Frame1Score9: req.body.Frame1Score9,
                  					Frame2Score9: req.body.Frame2Score9,
									Frame1Score10: req.body.Frame1Score10,
                 					Frame2Score10: req.body.Frame2Score10,
									Frame1Score11: req.body.Frame1Score11,
                  					Frame2Score11: req.body.Frame2Score11
                };
                res.render('DisplayCompletePlayerInfo.ejs', placeHolderValues);
            }
           
    });});});});});});});});});});});});});});
});
router.post('/InsertLane', function (req, res) {
	 db.InsertPlayerLane( req.body, function (err, result) {
    db.InsertLane( req.body, function (err, result) {
   
            if (err) throw err;

            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	LaneNum: req.body.LaneNum,
					NumofPlayers: req.body.NumofPlayers,
                    PlayerID: req.body.PlayerID, 
                    CurrentRound: req.body.CurrentRound, 
                    GameNum: req.body.GameNum
									
                };
                res.render('displayLaneInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Player was not inserted.');
            }
        });});
});
router.post('/InsertPlayerLane', function (req, res) {
    db.InsertPlayerLane( req.body, function (err, result) {
            if (err) throw err;

            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	PlayerID: req.body.PlayerID,
		    		LaneNum: req.body.LaneNum
                };
                res.render('displayPlayerLaneInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Player was not inserted.');
            }
        }
    );
});
router.post('/InsertScore', function (req, res) {
    db.InsertScore( req.body, function (err, result) {
            if (err) throw err;

            if(result.PlayerID != 'undefined') {
                var placeHolderValues = {
                	PlayerID: req.body.PlayerID,
					RoundNum: req.body.RoundNum,
                    Frame1Score: req.body.Frame1Score,
                    Frame2Score: req.body.Frame2Score,
                    GameNum: req.body.GameNum
                };
                res.render('displayScoreInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Player was not inserted.');
            }
        }
    );
});


module.exports = router;

