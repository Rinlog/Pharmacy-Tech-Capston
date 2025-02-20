function SortbyHeader(filteredData, header,direction){
    return filteredData.sort((a, b) => {

        let first = a[header];
        let second = b[header];

        //convert to lowercase strings if there is upcase letters
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
 

        //sort info for asc and dsc rows
        if (direction === 'asc') {
            
            if (first > second ) {
                return 1;
            }
            else if (first < second){
                return -1;
            }
            else {
                return 0;
            }
        } 
        else {

            if (first < second) {
                return 1;
            }
            else if (first > second) {
                return -1;
            }
            else {
                return 0;
            }
        }
    })

}

export default SortbyHeader;