# s3-simple
In this application we are going to add records to dynamodb table.
We have an IAM role statement to allow access to S3. 
Next we have a list of functions:
hello function that takes an HTTP event get method and calls the hello handler when the hello path is hit with this path variable.
readS3 function which calls handler.reads3  for a HTTP GET event with the readS3 path. 
getauthors function which again uses a HTTP GET event and expects an email parameter in the URL path, and when invoked calls the handler.getauthor method. 
createauthor: this time we're using HTTP POST event to invoke handler.createauthor. Here we are creating a simple DynamoDB table that holds a list of authors. we create a simple DynamoDB table keyed on email address, which contains some info about these authors, and we're going to have two methods in order to interact with this table.createauthors which populate the table using the post method and getauthors : query information from that table based on email address. 
In Yaml file under resources, we manage resources that our Lambda requires in order to run correctly. We create a new resource of type AWSDynamoDBtable, we're going to call that table the authorstable, and define some attributes. 
In Serverless configuration we defined a pathparameter called email. we're going to retrieve that from the Lambda event.
 we create a query parameter object and this is what the DynamoDB document client requires in order to run a query against DynamoDB. 
   
A query in DynamoDB is where you attempt to fetch an object based on a primary key.  In key condition expression we want is to match the email address key field against an email address that was supplied, and this expression attribute values component basically just swaps in this email address string field for the actual value that's come from our pathparameter. 
  
createauthors : This is a post method. All of the data we expect to insert into DynamoDB should come in the body of the request. We will attempt to retrieve the data from the body by parsing the JSON data contained inside and assigning it to the constant. 
   
   We create four variables emailaddress, firstname, lastname and coursetitle, and these are the fields we expect to insert into our DynamoDB table.  emailaddress is the key field. we create a DynamoDB parameter object which the document client is going to use for the insert operation.  If there's an error let's log it out and return it to the caller with a HTTP 501 status, internal server error, and assuming it works let's create a response object with a HTTP status 200, which signifies that everything worked ok, and stringify what we inserted. 
   
