//function to handle sorting when a header is clicked
import SortbyHeader from "./sortByHeader";
const SortByHeader = SortbyHeader;
const headerSort = (header,swap,column, setColumn,sortOrder, setOrder, Data, setData) => {
    //toggle sort order if clicking the same column, otherwise it will do ascending
    console.log(header);
    if (swap == true){
        let newSortOrder = 'asc';
        if (column === header && sortOrder === 'asc') {
            newSortOrder = 'desc';
        }
        setColumn(header);
        setOrder(newSortOrder);
        let sortedData = SortByHeader(Data,header,newSortOrder);
        setData(sortedData);
    }
    else{
        let sortedData = SortByHeader(Data,header,sortOrder);
        setColumn(header);
        setData(sortedData);
    
    }
};
export default headerSort;