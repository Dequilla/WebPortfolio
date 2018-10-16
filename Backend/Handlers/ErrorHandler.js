
// Move to logger?
exports.logError = function(fileName, message)
{
    /* TODO: Log to file/ choose where and how to log, also timestamp etc */
    console.log("Error in file: \"" + fileName + "\", with message: \"" + message + "\".\n");
}

exports.setError = function(response, error)
{
    response.cookie("error", error);
}

exports.setMessage = function(response, message)
{ 
    response.cookie("message", message);
}

// Get all the errors in the errror cookie on the clients side from previous page
exports.getError = function(response, request)
{
    var error = request.cookies.error;
    response.clearCookie("error");
    return  error;
}

// Get all the messages in the errror cookie on the clients side from previous page
exports.getMessage = function(response, request)
{
    var message = request.cookies.message
    response.clearCookie("message");
    return message;
}
