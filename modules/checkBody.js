function checkBody(body , elmtToTest){
    for (const elmt of elmtToTest){
        if (!body[elmt]) return false
    }
    return true
}

module.exports = {checkBody}