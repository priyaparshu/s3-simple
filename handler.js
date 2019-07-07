'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const dynamodb = new AWS.DynamoDB.DocumentClient();
const Tablename = process.env.DYNAMODB;
const kinesis = new AWS.Kinesis({ region: "us-east-1" });
const stream_name = process.env.STREAMNAME;

AWS.config.update({
  region: "us-east-1"
})
console.log(Tablename)

module.exports.hello = async (event, context) => {
  //console.log(event)
  console.log(event.pathParameters.name);


  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello' + event.pathParameters.name + 'welcome',
      input: event,
    }),
  };
};

// S3 Bucket

module.exports.reads3 = function (event, context, callback) {
  var src_bkt = 'shouldnotbe'
  var src_key = 'boto3.txt'

  s3.getObject({
    Bucket: src_bkt,
    Key: src_key
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      callback(err)
    } else {
      console.log('\n\n' + data.Body.toString() + '/n');
      //callback(null, data.Body.toString())
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          //message: data.Body.toString()
          s3Data: data.Body.toString()
        })
      }
      callback(null, response)
    }
  })
}

//DynamoDb
module.exports.getauthors = (event, context, callback) => {

  console.log(event.pathParameters.email);
  const email_address = event.pathParameters.email;

  const Params = ({
    TableName: Tablename,
    KeyConditionExpression: 'email_address = :email_address',
    ExpressionAttributeValues: {
      ":email_address": email_address
    }
  })

  dynamodb.query(Params, (err, data) => {
    if (err) {
      console.log("+++++++++++++++++")
      console.error('Unable to Query', JSON.stringify(err, null, 2))
    } else {
      console.log("Items", data.Items)
      console.log('Query Successful')
      console.log(data)
      const response = {
        statusCode: 200,
        body: JSON.stringify({ DynamoData: data.Items })
      }
      callback(null, response);
    }

  })
};

module.exports.createauthors = function (event, context, callback) {
  const data = JSON.parse(event.body);
  console.log(data);

  var email_address = data.email_address;
  var first_name = data.first_name;
  var last_name = data.last_name;
  var course_title = data.course_title;

  var Params = {
    TableName: Tablename,
    Item: {
      email_address: email_address,
      first_name: first_name,
      last_name: last_name,
      course_title: course_title
    }

  }
  console.log('Inserting Items', Params.Item)


  dynamodb.put(Params, (err, data) => {
    if (err) {
      console.error(err);


      const response = {
        statusCode: 501,
        body: JSON.stringify({
          message: 'Could nt create Item'
        })
      }
      return response;
    };
    const response = {
      statusCode: 200,
      body: JSON.stringify(
        Params.Item)
    }
    console.log(date.Item)
    console.log('Item added successfully', JSON.stringify(data.Item, null, 2))
    callback(null, response);
  })
}
module.exports.produce = function (event, context, callback) {
  for (var i = 0; i < 100; i++) {
    _writeToKinesis();
  }

  function _writeToKinesis() {
    var curTime = new Date().getMilliseconds();
    var sensor = "sensor-" + Math.floor(Math.random() * 100000);
    var reading = Math.floor(Math.random() * 1000000)


    var record = JSON.stringify({
      time: curTime,
      sensor: sensor,
      reading: reading
    })

    var recordParams = ({
      Data: record,
      PartitionKey: sensor,
      StreamName: stream_name
    })

    kinesis.putRecord(recordParams, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        console.log("successfully sent data to kinesis")
      }
    })
  }
}