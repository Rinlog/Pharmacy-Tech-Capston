function SortbyHeader(filteredData, header,direction){
    return filteredData.sort((a, b) => {

        let first = a[header];
        let second = b[header];

        const isDateString = (value ) => {
            if (typeof value !== 'string') {
                return false;
            }

            //lazy and gbt made regEx
            const dataRegex = /^\d{4}-\d{2}-\d{2}(\s.*)?$/;
            return dataRegex.test(value);
        }

        //need this here to pull the number from the text
        const extractNumber = (value) => {

            //needed if its in date format
            if (isDateString(value)) {
                return new Date(value).getTime();
            }

            //checking if its a number
            if (typeof value === "number") {
                return value;
            }
            
            //need to convert the string to a number
            const num = parseFloat(value);
            
            if (isNaN(num)) {
                return value.toString().toLowerCase();
            } 
            else {
                return num;
            }
        };

        first = extractNumber(first);
        second = extractNumber(second);

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