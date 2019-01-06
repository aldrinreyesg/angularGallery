function userBooleanFormatter(value, row, index) {
    if(value){
        return '<div class="text-success"><i class="fas fa-user-check"></i></div>';
    }else{
        return '<span class="text-center text-danger"><i class="fas fa-user-times"></i></span>';
    }
}
function dateFormatter(value, row, index) {
    var date = moment(value);
    return date.format("YYYY-MM-DDD");
}
function publicFormatter(value, row, index) {
    if(value){
        return '<div class="text-success"><i class="fas fa-eye"></i></div>';
    }else{
        return '<span class="text-center text-danger"><i class="fas fa-eye-slash"></i></span>';
    }
}
function shortenFormatter(value, row, index) {
    var str = '';
    if (value.length > 12){
        var len = value.length;
        str = value.substr(0, 20) + '...' + value.substr(len - 6, len);
    }else{
        str = value;
    }
    return str;
}
