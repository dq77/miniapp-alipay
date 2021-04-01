
export function fmtDate(){
    var date =  new Date();
    var y = 1900+date.getYear();
    var m =(date.getMonth()+1);
    var d = date.getDate();
    return y+"-"+m+"-"+d;
}

export function filterDate(){}

