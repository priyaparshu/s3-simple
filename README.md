# s3-simple
In this application I am going to add records to dynamodb table. I have an IAM role statement in order to allow lambda to have permission to access S3. 
list of functions and its role:
hello function: takes an HTTP event get method and calls the hello handler, When the hello path is hit with this path variable.
readS3 function: This calls handler.reads3  for a HTTP GET event with the readS3 path. 
getauthors function which again uses a HTTP GET event and expects an email parameter in the URL path,and when invoked calls the handler.getauthor method. 
createauthor: this time I am using HTTP POST event to invoke handler.createauthor. Here I am creating a simple DynamoDB table that holds a list of authors. I create a simple DynamoDB table keyed on email address, which contains some info about these authors. I have two methods in order to interact with this table 
      createauthors: which populate the table using the post method 
      getauthors: query information from that table based on email address. 
In Yaml file under resources, I manage resources that the Lambda requires in order to run correctly. I created a new resource of type AWSDynamoDBtable, I going to call this table the "authorstable", and have defined some attributes. 

I created a query parameter object and this is what the DynamoDB document client requires in order to run a query against DynamoDB. 
   
A query in DynamoDB is where you attempt to fetch an object based on a primary key.  In key condition expression we want is to match the email address key field against an email address that was supplied, and this expression attribute values component basically just swaps in this email address string field for the actual value that's come from our pathparameter. 
  
createauthors: This is a post method. All of the data we expect to insert into DynamoDB should come in the body of the request. We will attempt to retrieve the data from the body by parsing the JSON data contained inside and assigning it to the constant. 
   
I created four variables emailaddress, firstname, lastname and coursetitle, and these are the fields that I need to insert into our DynamoDB table. "emailaddress" is the key field. I created a DynamoDB parameter object which the document client is going to use for the insert operation.  If there's an error let's log it out and return it to the caller with a HTTP 501 status "internal server error", and a response object with a HTTP status 200, which signifies that everything worked ok, and stringify what was inserted. 
   
