function kConverter(num){
    if(num >= 1000){
        let val = (num / 1000).toFixed(1)
        return val + 'k';
    }
    else return num;
}

export default kConverter