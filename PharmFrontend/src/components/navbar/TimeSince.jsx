function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = {
        "year": 31536000,
        "month":2592000,
        "day":86400,
        "hour":3600,
        "minute":60,
        "second":1
    }
    let BaseTime = "";
    let SecondTime = "";
    for (let time in interval){
        if (seconds > interval[time]){
            if (BaseTime == ""){
                BaseTime = Math.floor(seconds/interval[time]);//sets the base time to the first interval it fits within
                seconds = seconds- (interval[time]*BaseTime); //removes it from the seconds

                if (BaseTime > 1){
                    BaseTime += " " + time + "s";
                }
                else{
                    BaseTime += " " + time
                }
            }
            else{
                SecondTime += Math.floor(seconds/interval[time]);
                if (SecondTime > 1){
                    SecondTime += " " + time + "s"
                }
                else{
                    SecondTime += " " + time;
                }
                break;
            }
        }
    }
    
    return BaseTime + " " + SecondTime;
  }
  export default timeSince;