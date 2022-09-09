import React, {useState} from 'react';

const Dropdown = (props) => {
    
    const selected = e => {
        props.changed(e.target.value);
    } 

    return (
        <div>
            <select value={props.selected} onChange={selected}>
                <option key={0}>Select</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item.value}>{item.name}</option>)}
            </select>
        </div>
    );
}

export default Dropdown;