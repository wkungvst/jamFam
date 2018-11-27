var express = require("express")
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser());
const MongoClient = require('mongodb').MongoClient

app.get('/test', function(req,res){
	res.json({result: "success!" })
});

const port = 8000;
var dbUrl = 'mongodb://william:Hellokitty99@ds159263.mlab.com:59263/jamfam';

MongoClient.connect(dbUrl, (err, client) => {

    console.log('we connected');
	if (err) return console.log(err)
	db = client.db('jamfam') 
	app.listen(port, ()=>{
		console.log('hi we are live on port ' + port);
	});


	// REGISTRATION
	app.post('/user/registerUser', (req, res)=>{
		db.collection("users").find({}).toArray(function(error, users) {
		    if (err) throw err;
		    if(check_user_valid(users, req.body.Username)){
		    	res.json({"IsSuccess" : true, "UserId" : 1})	
				console.log('we good');
				save_user(users, req);
		    }else{
		    	res.json({"IsSuccess" : false, "ErrorMessage" : "User already reigstered", "ErrorCode" : 1})		
		    	console.log('already taken. no gucci');
		    }
		});
	});


	// LOGIN
	app.post('/user/authenticateUser', (req, res)=>{
		var query = {Username: req.body.Username.toLowerCase()};
		db.collection("users").find(query).toArray(function(err, result){
		if (err) throw err;
		if(result.length == 1){
			if(result[0].PasswordHash == req.body.PasswordHash){
				res.json({IsSuccess: true, Message: "Successful Login"});
			}else{
				res.json({IsSuccess: false, ErrorMessage: "Incorrect Username or Password", ErrorCode: "2"});
			}
		}else{
			res.json({IsSuccess: false, ErrorMessage: "Incorrect Username or Password", ErrorCode: "1"});
		}
		    console.log(result);
		    return;
		});
	});

	var save_user = function(users, request){
		var obj = {
			Username : request.body.Username.toLowerCase(),
			PasswordHash : request.body.PasswordHash,
			_id : users.length +1
		}
		db.collection('users').insertOne(obj, (err, result)=>{
			if(err){
				console.log('something bad happen')
				return console.log(err)
			}
			console.log('saved to database')
		});
	};

	var check_user_valid = function(users, newUserName){
		console.log("check users. users size: " + users.length + " new username: " + newUserName) ;
		for(var i =0;i<users.length;i++){
			if(users[i].Username == newUserName){
				console.log('duplicate: ' + newUserName + ' is the same as ' + users[i].Username);
				return false;
			}
			console.log('user: ' + users[i].Username + "\n");
		}
		return true;
	};

})


