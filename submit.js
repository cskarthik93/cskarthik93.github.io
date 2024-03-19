exports.handler = async function(event, context) {
    console.log("Form submission received!");
    console.log(event.body);
   
    return {
       statusCode: 200,
       body: JSON.stringify({ message: "Form submission received!" }),
    };
   };
   