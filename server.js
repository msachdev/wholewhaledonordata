var express = require('express');
var anyDB = require('any-db');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var hogan = require('hogan.js');
var http = require('http');
var parse = require('csv-parse');
var fs = require('fs')
var request = require('request')

var app = express();
//var session = require('express-session');

app.use(express.static(path.join(__dirname, '/css')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/pages'); // tell Express where to find templates, in this case the '/pages' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages
app.use(express.static(__dirname + '/scripts'));

const createTable = 'CREATE TABLE IF NOT EXISTS donors (OrganizationID INTEGER, FirstName TEXT, LastName TEXT, Email TEXT, DonationDate TEXT, DonationAmount TEXT);';

var conn = anyDB.createConnection('sqlite3://wholewhale.db'); // create database connection
var server = http.createServer(app);
conn.query(createTable, function(error, data){
	if (error != null) { console.log(error); }
	fs.readFile('MockDonorsData.csv', function(err, data){
		parse(data, function(err, output){
			output.forEach(otpt => {
				//console.log(otpt);			
				var sql = 'INSERT INTO donors(OrganizationID, FirstName, LastName, Email, DonationDate, DonationAmount) VALUES ($1, $2, $3, $4, $4, $6);';
				conn.query(sql, [otpt[1], otpt[2], otpt[3], otpt[4], otpt[5], otpt[6]], function(error, result) {
					if (error != null) { console.log(error); }
					//console.log("successfully added to db");
				})
			})
		})
	});
});

// get request for page
app.get('/', function(request, response) {
	console.log('GET request for page'); 
	response.render('index.html');
});

app.get('/getData', function(request, response){
	console.log("get request for donor table")
	var donorList = []
	q = conn.query('SELECT * from donors', function(err, result){
		for (var i = 0; i < result.rowCount; i++){
			var donorData = {
				OrganizationID: result.rows[i].OrganizationID,
				FirstName: result.rows[i].FirstName,
				LastName: result.rows[i].LastName,
				Email: result.rows[i].Email,
				DonationDate: result.rows[i].DonationDate,
				DonationAmount: result.rows[i].DonationAmount
			}
			donorList.push(donorData);
		}
	});
	q.on('end', function(){
		response.json(donorList);
	})
});
app.post('/export', function(request, response) {
	console.log('POST request for export');
	var newRoomURL = request.protocol + '://' + request.get('host') + '/' + newRoomID;
	console.log('Room URL: ' + newRoomURL);
	response.redirect(newRoomURL);
});

/* var config = {
	"apiVersion": "2012-08-10",
	"accessKeyId": "AKIAJT35L6QL35JNORA",
	"secretAccessKey": "Ufv9RxFsbYm19e/813Ec5LnnyLsu9jMKOjjGQ9Cx",
	"region":"us-west-2",
	"endpoint": "http://localhost:8000"
  } */

//AWS.config.update();

//var dynamodb = new AWS.DynamoDB(config);

//console.log("Reading CSV file.")

/* const csv = require('csvtojson')
const csvFilePath= 'MockDonorsData.csv'

var params = {
	TableName : "Donors",
	KeySchema: [
		{AttributeName: "OrganizationId", KeyType: "HASH"} //Partition key
	],
	AttributeDefinitions: [
		{AttributeName: "OrganizationId", AttributeType: "S"},
		{AttributeName: "FirstName", AttributeType: "S"},
		{AttributeName: "LastName", AttributeType: "S"},
		{AttributeName: "EmailAddress", AttributeType: "S"},
		{AttributeName: "DonationDate", AttributeType: "S"},
		{AttributeName: "DonationAmount", AttributeType: "S"}
	],
	ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
}; */

/* csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
	fs.writeFile('MockDonorsData.json', JSON.stringify(jsonObj), 'utf8', function(err){
		if(err){
			console.log(err)
		}
		dynamodb.createTable(params, function(err, data) {
			if (err) {
				console.log('here_2')
				console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
			}
		});
		var docClient = new AWS.DynamoDB.DocumentClient();

		console.log("Importing data into DynamoDB")

		var allDonors = JSON.parse(fs.readFileSync('MockDonorsData.json', 'utf8'));

		allDonors.forEach(function(donor){
			var params = {
				TableName: "Donors",
				Item: {
					"OrganizationId": donor.OrganizationId,
					"FirstName": donor.FirstName,
					"LastName": donor.LastName,
					"EmailAddress": donor.EmailAddress,
					"DonationDate": donor.DonationDate,
					"DonationAmount": donor.DonationAmount
				}
			};

			docClient.put(params, function(err, data){
				if (err) {
					console.error("Unable to add donor", donor.OrganizationId, ". Error JSON:", JSON.stringify(err, null, 2))
				} else {
					console.log("PutItem succeeded:", donor.OrganizationId);
				}
			});
		}); 
	})
})  */

/* var fileInputName = 'MockDonorsData.csv'
var fileOutputName = 'MockDonorsData.json'
csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(fileInputName, fileOutputName);
 */
/* 
var params = {
	TableName : "Donors",
	KeySchema: [
		{AttributeName: "OrganizationId", KeyType: "HASH"} //Partition key
	],
	AttributeDefinitions: [
		{AttributeName: "OrganizationId", AttributeType: "S"},
		{AttributeName: "FirstName", AttributeType: "S"},
		{AttributeName: "LastName", AttributeType: "S"},
		{AttributeName: "EmailAddress", AttributeType: "S"},
		{AttributeName: "DonationDate", AttributeType: "S"},
		{AttributeName: "DonationAmount", AttributeType: "S"}
	],
	ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};
console.log('here_1')
dynamodb.createTable(params, function(err, data) {
    if (err) {
		console.log('here_2')
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB")

var allDonors = JSON.parse(fs.readFileSync('MockDonorsData.json', 'utf8'));

allDonors.forEach(function(donor){
	var params = {
		TableName: "Donors",
		Item: {
			"OrganizationId": donor.OrganizationId,
			"FirstName": donor.FirstName,
			"LastName": donor.LastName,
			"EmailAddress": donor.EmailAddress,
			"DonationDate": donor.DonationDate,
			"DonationAmount": donor.DonationAmount
		}
	};

	docClient.put(params, function(err, data){
		if (err) {
			console.error("Unable to add donor", donor.OrganizationId)
		} else {
			console.log("PutItem succeeded:", donor.OrganizationId);
		}
	});
}); 
 */

server.listen(8080, function() {
	console.log("Listening on port 8080");
  });