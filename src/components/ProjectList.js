import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';

let ProjectList = () => {
    let [state, setState] = useState({
        loading: false,
        projects: [],
        errorMessage: null
    });

    const [selectedProjects, setSelectedProjects] = useState([]);
    const dt = useRef(null);

    const fetchData = async () => {
        setState({...state, loading: true});
        let response = await axios.get('http://localhost:3001/content');
        setState({
            ...state,
            loading: false,
            projects: response.data
        })
        
    };

    useEffect(() => {
        try {
          fetchData();  
        }
        catch (error) {
            setState({
                ...state,
                errorMessage: error
            })
        }
    }, []);

    const navigate = useNavigate();

    const cols = [
        { field: 'name', header: 'Name' },
        { field: 'machine.name', header: 'Machine' },
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, state.projects);
                doc.save('projects.pdf');
            })
        })
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(state.projects);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'projects');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    }

    const onSelectionChange = (e) => {
        setSelectedProjects(e.value);
    }

    const header = (
        <div className="flex align-items-center export-buttons">
            <Button type="button" icon="pi pi-file"       onClick={() => exportCSV(false)} className="mr-2"                  data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" onClick={exportExcel}            className="p-button-success mr-2" data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf"   onClick={exportPdf}              className="p-button-warning mr-2" data-pr-tooltip="PDF" />
            <Button type="button" icon="pi pi-filter"     onClick={() => exportCSV(true)}  className="p-button-info ml-auto" data-pr-tooltip="Selection Only" />
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button onClick={() => navigate(`/details/${rowData.id}`)} className="p-button-success pr-6 pl-6">
                    Details
                </Button>
            </React.Fragment>
        );
    }

    const displayTime = (rowData) => {
        let unix_timestamp = rowData.timestamp;
        let date = new Date(unix_timestamp);

        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

        let formatedData = day + '/' + month + '/' + year;
        let formatedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        
        return (
            <>
                <p>{formatedData}</p>
                <p>{formatedTime}</p>
            </>
        );
    }

  return (
    <>
        <div className='card'>
            <Tooltip target=".export-buttons>button" position='bottom'/>
            <DataTable ref={dt} value={state.projects} header={header} dataKey='id' responsiveLayout='scroll' selectionMode="multiple"  onSelectionChange={onSelectionChange}>
                {cols.map((col, index) => <Column key={index} field={col.field} header={col.header}/>)}
                <Column header="Time" body={displayTime}/>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} header='More'/>
            </DataTable>
        </div>
    </>
  )
};

export default ProjectList;
