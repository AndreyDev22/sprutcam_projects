import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';
import image from './image/3.jpeg';

const DetailsPage = () => {
    const { id } = useParams();
    const toast = useRef(null);
    const [details, setDetails] = useState();

    const fetchDetails = async () => {
        const { data } = await axios.get(`http://localhost:3001/content/${id}`);
        setDetails(data);
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    let axes = [];
    for (let i = 0; i < details?.machine.machineStateParameterList.length; i++) {
        axes.push(details?.machine.machineStateParameterList[i].address);
    }

    /* ============== ToolType ================ */
    let toolType = [];
    for (let i = 0; i < details?.tools.length; i++) {
        toolType.push(details?.tools[i].toolType);
    }

    let uniqueToolType = toolType.filter(function(item, pos) {
        return toolType.indexOf(item) == pos;
    })
    /* ======================================== */

    /* ============== OperationType ================ */
    let operationType = [];
    for (let i = 0; i < details?.operations.length; i++) {
        operationType.push(details?.operations[i].type);
    }

    let uniqueOperationType = operationType.filter(function(item, pos) {
        return operationType.indexOf(item) == pos;
    })
    /* ============================================ */

    const displayTime = () => {
        let unix_timestamp = details?.timestamp;
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
    };

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success Message', detail: 'Позже здесь будет загрузка проекта', life: 3000});
    };


  return (
    <div className='details_container'>
        <div className='title'>
           <h1>{details?.name}</h1> 
           <Toast ref={toast}/>
           <Button label='Download' className='p-button-success' onClick={showSuccess}/>
        </div>
      

        <div className='details_content'>
            <div className='image'>
                <img src={image} width={400} height={400} alt=""/>
            </div>
            <div className='name_machine'>
                <h3>Machine Name</h3>
                <h4>{details?.machine.name}</h4>
            </div>
            <div className='axes'>
                <h3>Axes</h3>
                <ListBox options={axes} style={{textTransform: 'uppercase', fontSize: '15px'}}/>
            </div>
            <div className='tool_type'>
                <h3>ToolType</h3>
                <ListBox options={uniqueToolType} style={{textTransform: 'uppercase', fontSize: '15px'}}/>
            </div>
            <div className='operation_type'>
                <h3>OperationType</h3>
                <ListBox options={uniqueOperationType} style={{textTransform: 'uppercase', fontSize: '15px'}}/>
            </div>
            <div className='time_load'>
                <h3>Time Loading</h3>
                <h4>{displayTime()}</h4>
            </div>
        </div>
    </div>
  )
}

export default DetailsPage
