var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'cwolf.cs.sonoma.edu',
    user: 'emakela',
    password: '003560978'
    //user: 'your_username',
    //password: 'your_password'
});

var dbToUse = 'emakela';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

//create the Account table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Player('
        + 'PlayerID INT(5) PRIMARY KEY AUTO_INCREMENT '
		+ ',Name VARCHAR(50) NOT NULL'
        + ',ShoeSize VARCHAR(4)'
        + ',GenderofShoe VARCHAR(7)'
        + ');';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Lane('
        + 'LaneNum INT(2)'
		+ ',NumofPlayers INT(1)'
		+ ',PlayerID INT(5)'
		+ ',CurrentRound INT(2)'
        + ' ,Foreign Key (PlayerID) references Player(PlayerID)'
        + ' ON UPDATE CASCADE ON DELETE CASCADE'
        + ');';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS PlayerLane('
        + 'PlayerID Int(5) References Player(PlayerID)'
		+ ',LaneNum Int(2) References Lane(LaneNum)'
		+ ' ON UPDATE CASCADE ON DELETE CASCADE);'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Score('
        + ' PlayerID INT(5)'
		+ ',RoundNum INT(2)'
		+ ',Frame1Score INT(2)'
		+ ',Frame2Score INT(2)'
		+ ',GameNum INT'
        + ',Foreign Key (PlayerID) references Player(PlayerID)'
        + ' ON UPDATE CASCADE ON DELETE CASCADE'
        + ');';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View OverallScore as '
        + 'SELECT p.Name, Sum(s.Frame1Score) + Sum(s.Frame2Score) as Overall,'
		+ ' AVG(s.Frame1Score) as Ave1stBall, AVG(s.Frame2Score) as Ave2ndBall'
		+ ', s.GameNum FROM Score s  RIGHT JOIN Player p ON p.PlayerID = s.PlayerID' 
		+ ' GROUP BY p.PlayerID;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
   
    });
});
exports.OverallScore = function(callback) {
	connection.query('select * from OverallScore;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View Strikes as '
        + 'SELECT p.Name, s.RoundNum, s.Frame1Score AS Strike, s.GameNum FROM Player p'
		+ ' JOIN Score s ON s.PlayerID = p.PlayerID WHERE Frame1Score = 10'
		+ ' ORDER BY p.Name;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    
    });
});
exports.Strikes = function(callback) {
	connection.query('select * from Strikes;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View Spares as '
        + 'SELECT p.Name, s.RoundNum, s.Frame1Score as BallOne, s.Frame2Score as BallTwo,' 
        + ' s.Frame1Score + s.Frame2Score as Spare, s.GameNum FROM Player p JOIN Score s ON'
        + ' s.PlayerID = p.PlayerID WHERE s.Frame1Score + s.Frame2Score = 10'
        + ' AND Frame1Score != 10 ORDER BY p.Name;';

    connection.query(createViewQry, function (err) {
        if (err) throw err;
    
    });
});
exports.Spares = function(callback) {
	connection.query('select * from Spares;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View ShoeRentalsMale as '
        + 'SELECT  p.Name, p.ShoeSize, p.GenderofShoe, l.CurrentRound FROM Player p'
        + ' Left JOIN Lane l on p.PlayerID = l.PlayerID GROUP BY p.PlayerID HAVING'
        + ' ShoeSize != "undefined" ORDER BY p.Name;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
   
    });
});
exports.ShoeRentalsMale = function(callback) {
	connection.query('select * from ShoeRentalsMale;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View ShoeRentalsFemale as '
        + 'SELECT  p.Name, p.ShoeSize, p.GenderofShoe FROM Player p HAVING'
        + ' GenderofShoe = "Female" and ShoeSize != "undefined" ORDER BY p.Name;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});
exports.ShoeRentalsFemale = function(callback) {
	connection.query('select * from ShoeRentalsFemale;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View PlayersinLane as '
        + 'SELECT  p.Name, l.LaneNum  AS LaneNumber, ifNull(p.ShoeSize, "No Rental")'
        + ' AS ShoeRental, NumofPlayers  AS PlayersinLane, ifNull(l.CurrentRound, "GameOver")'
        + ' AS CurrentRound, p.PlayerID FROM Player p JOIN Lane l JOIN PlayerLane pl'
        + ' ON p.PlayerID = l.PlayerID = pl.PlayerID ORDER BY l.LaneNum;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});
exports.ShoeRentalsFemale = function(callback) {
	connection.query('select * from PlayersinLane;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View GutterBalls as '
        + 'SELECT p.Name, s.RoundNum, s.Frame1Score AS BallOne, s.Frame2Score AS BallTwo, s.GameNum'
        + ' FROM Player p JOIN Score s ON s.PlayerID = p.PlayerID WHERE s.Frame1Score = 0'
        + ' AND s.Frame2Score = 0 ORDER BY p.Name;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});
exports.GutterBalls = function(callback) {
	connection.query('select * from GutterBalls;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View PlayersinLane as '
        + 'SELECT  p.Name, l.LaneNum  AS LaneNumber, ifNull(p.ShoeSize, "No Rental")' 
		+ ' AS ShoeRental, NumofPlayers AS PlayersinLane, ifNull(l.CurrentRound, "GameOver")'
		+ ' AS CurrentRound, p.PlayerID FROM Player p JOIN Lane l JOIN PlayerLane pl ON'
		+ ' l.PlayerID = p.PlayerID = pl.PlayerID ORDER BY l.LaneNum;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});
exports.PlayersinLane = function(callback) {
	connection.query('select * from PlayersinLane;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View GetUsernameAndID as '
        + 'SELECT Name, PlayerID from Player;';
            connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});
exports.GetUsernameAndID = function(callback) {
	connection.query('select * from GetUsernameAndID;',
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}






exports.GetPlayer = function(callback) {
	connection.query('select * from Player;',
	
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetSinglePlayer = function(userInfo, callback) {
    connection.query('select * from Player where PlayerID = ' + userInfo.PlayerID + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}


exports.GetScoreByID = function(PlayerID, callback) {
	var query = 'select p.PlayerID, p.Name, s.RoundNum, s.Frame1Score, s.Frame2Score from'
		+ ' Player p left join Score s p on a.AccountID = s.AccountID where p.PlayerID ='
		+ ' ' + PlayerID + ';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 

exports.InsertPlayer = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Player (Name, ShoeSize, GenderofShoe) '
    			+ 'VALUES (\'' 
    			+ userInfo.Name + '\', \'' 
    			+ userInfo.ShoeSize + '\', \'' 
    			+ userInfo.GenderofShoe 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            console.log(result);
            callback(false, result);
        }
    );
}

exports.InsertLane = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Lane (LaneNum, NumofPlayers, PlayerID, CurrentRound) '
    			+ 'VALUES (\'' 
    			+ userInfo.LaneNum + '\', \'' 
    			+ userInfo.NumofPlayers + '\', \'' 
				+ userInfo.PlayerID + '\', \''
    			+ userInfo.CurrentRound 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertPlayerLane = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO PlayerLane (PlayerID, LaneNum) '
    			+ 'VALUES (\'' 
    			+ userInfo.PlayerID + '\', \'' 
    			+ userInfo.LaneNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (\'' 
    			+ userInfo.PlayerID + '\', \'' 
    			+ userInfo.RoundNum + '\', \'' 
    			+ userInfo.Frame1Score + '\', \'' 
    			+ userInfo.Frame2Score + '\', \''
    			+ userInfo.GameNum
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.InsertScore1 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '1' + '\', \'' 
    			+ userInfo.Frame1Score1 + '\', \'' 
    			+ userInfo.Frame2Score1 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore2 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '2' + '\', \'' 
    			+ userInfo.Frame1Score2 + '\', \'' 
    			+ userInfo.Frame2Score2 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore3 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \'' 
    			+ '3' + '\', \'' 
    			+ userInfo.Frame1Score3 + '\', \'' 
    			+ userInfo.Frame2Score3 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore4 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '4' + '\', \'' 
    			+ userInfo.Frame1Score4 + '\', \'' 
    			+ userInfo.Frame2Score4 + '\', \''
    			+ userInfo.GameNum  
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore5 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '5' + '\', \'' 
    			+ userInfo.Frame1Score5 + '\', \'' 
    			+ userInfo.Frame2Score5 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore6 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \'' 
    			+ '6' + '\', \'' 
    			+ userInfo.Frame1Score6 + '\', \'' 
    			+ userInfo.Frame2Score6 + '\', \''
    			+ userInfo.GameNum  
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore7 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '7' + '\', \'' 
    			+ userInfo.Frame1Score7 + '\', \'' 
    			+ userInfo.Frame2Score7 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore8 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '8' + '\', \'' 
    			+ userInfo.Frame1Score8 + '\', \'' 
    			+ userInfo.Frame2Score8 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore9 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \'' 
    			+ '9' + '\', \'' 
    			+ userInfo.Frame1Score9 + '\', \'' 
    			+ userInfo.Frame2Score9 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore10 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \''
    			+ '10' + '\', \'' 
    			+ userInfo.Frame1Score10 + '\', \'' 
    			+ userInfo.Frame2Score10 + '\', \''
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertScore11 = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Score (PlayerID, RoundNum, Frame1Score, Frame2Score, GameNum) '
    			+ 'VALUES (' 
    			+' (select PlayerID from Player where Name= \'' + userInfo.Name +'\')' + ', \'' 
    			+ '11' + '\', \'' 
    			+ userInfo.Frame1Score11 + '\', \'' 
    			+ userInfo.Frame2Score11 + '\', \'' 
    			+ userInfo.GameNum 
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.EditScore = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'UPDATE Score s Set'
    			+ ' s.Frame1Score = \'' + userInfo.Frame1Score 
    			+ '\', s.Frame2Score = \'' + userInfo.Frame2Score 
    			+ '\' WHERE s.PlayerID = ' + userInfo.PlayerID 
    			+ ' AND s.RoundNum = ' + userInfo.RoundNum;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}


exports.GetByUsername = function(userInfo, callback) {
	var query = 'select * from Player where Name = \'' + userInfo.Name +'\';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 

exports.GetByID = function(userInfo, callback) {
	var query = 'select * from Player where PlayerID = ' + userInfo.PlayerID + ';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 
