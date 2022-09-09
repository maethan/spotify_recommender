import React, {useState} from 'react';

const Dropdown = (props) => {
    
    const selected = e => {
        props.changed(e.target.value);
    } 

    return (
        <div className="col-sm-5 px-0">
            <label className="list-group-head py-1 text-center rounded"> Genres: </label>
            <select value={props.selected} onChange={selected} className="form-control form-control-sm">
                <option key={0}>Select</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item.value}>{item.name}</option>)}
            </select>
        </div>
    );
}

export default Dropdown;