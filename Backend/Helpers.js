exports.verifyText = function(text)
{
    // Text contains nothing or only whitespaces
    if(!text.replace(/\s/g, '').length)
        return false;

    return true;
}
