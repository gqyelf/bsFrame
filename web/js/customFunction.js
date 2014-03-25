/**
 * Created by Gqy on 13-12-23.
 */


function gotoUrl(url ,param){
    var paramArray = param.split(',');
    var paramStr = "?";
    for(var i = 0 ; i<paramArray.length ; ++i){
        if( (i+1)<paramArray.length ){
            paramStr = paramStr+'value'+i+'='+paramArray[i]+'&';
        }else{
            paramStr = paramStr+'value'+i+'='+paramArray[i];
        }
    }
    window.open (url+".jsp"+paramStr);
}