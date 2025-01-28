import { useState, useEffect } from "react";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ModalTemplate = ({ isOpen, onClose, onSelect}) => {

    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [modalHeight, setModalHeight] = useState('auto');

    const GetData = async () => {
        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(response.status === 200) {
                // Get the data out of the response
                const fetchedData = await response.json();
                // Set the data state
                setData(fetchedData.data);
                // Set the filtered data state
                setFilteredData(fetchedData.data);
                // Set the table headers state
                setTableHeaders(fetchedData.headers);
                // Set the data fetched state
                setDataFetched(true);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(isOpen && !dataFetched) {
            GetData();
        }
    }, [isOpen, dataFetched]);

    useEffect(() => {
        const headerHeight = 40;
        const rowHeight = 40;
        const totalRowHeight = filteredData.length * rowHeight;
        const totalHeight = headerHeight + totalRowHeight;

        setModalHeight(totalHeight + 'px');
    }, [filteredData]);

    useEffect(() => {
        if(data.length > 0) {
            const filteredData = data.filter(item => {
                for(const key in item) {
                    if(item[key] && item[key].toString().toLowerCase().includes(search.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            });

            setFilteredData(filteredData);
        }
    }, [search, data]);

    const handleSelect = (rowData) => {
        onSelect(rowData);
        onClose();
    }

    const handleClose = () => {
        onClose();
    }

    return (
        isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight }}>
                    <span className="close" onClick={handleClose}>&times;</span>
                    <input className="form-control w-25 my-4" type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="table-wrapper">
                        <table className="table table-bordered table-reponsive">
                            <thead>
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th scope="col" className="text-black" key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} onClick={() => handleSelect(item)}>
                                        {tableHeaders.map(header => (
                                            <td className="text-black" key={header}>{item[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    );
}

export default ModalTemplate;