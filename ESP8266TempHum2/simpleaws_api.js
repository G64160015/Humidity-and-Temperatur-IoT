var awsIot = require('aws-iot-device-sdk');
var mysql = require('mysql');
var Database_URL = 'localhost';
var Topic = 'SensorSuhu2'; 
var device = awsIot.device({
 keyPath: 'cert2/private.pem.key',
 certPath: 'cert2/cer.pem.crt',
 caPath: 'cert2/root.pem',
 host: 'aawesprfngvmj-ats.iot.us-east-1.amazonaws.com',
 clientId: 'Server',
 });

 device.on('connect', function() {
 console.log('connected');
 device.subscribe(Topic,mqtt_subscribe);
 });
 device.on('message',  mqtt_messsageReceived);


function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
};
 function mqtt_messsageReceived(topic, message, packet) {
	var message_str = message.toString(); //convert byte array to string
	message_str = message_str.replace(/\n$/, ''); //remove new line
	//payload syntax: clientID,topic,message
	if (countInstances(message_str) != 1) {
		console.log("Invalid payload");
		} else {	
		insert_message(topic, message_str, packet);
		//console.log(message_arr);
	}
};

var connection = mysql.createConnection({
	host: Database_URL,
	port : 3306,
	user: "root",
	password: "",
	database: "temphum" //db name
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});

//insert a row into the tbl_messages table
function insert_message(topic, message_str, packet) {
	var message_arr = extract_string(message_str); //split a string into an array
	var temperature = Number(message_arr[0]);
	var humidity = Number(message_arr[1]);


	var sql = "INSERT INTO ?? (??,??) VALUES (?,?)";
	var params = ['dht21','temperature2','humidity2', temperature, humidity];//dht21 = table name
	sql = mysql.format(sql, params);
	
	connection.query(sql, function (error, results) {
		if (error) throw error;
		console.log("Success");
	}); 
};	

//split a string into an array of substrings
function extract_string(message_str) {
	var message_arr = message_str.split(","); //convert to array	
	return message_arr;
};	

//count number of delimiters in a string
var delimiter = ",";
function countInstances(message_str) {
	var substrings = message_str.split(delimiter);
	return substrings.length - 1;
};