import React from 'react';

const Clicklist = props => {

    const clicked = e => {
        e.preventDefault();
        console.log('props: ' + props.items.name);
        console.log('clicky: ' + e.target.id);
        props.clicked(e.target);
    }
    return (
        <div className="col-sm-5">
            <div className="list-group py-1">
                <label className="list-group-head py-1 text-center rounded">{props.label}</label>
                {
                    props.items.map((item, idx) => 
                    <button className="list-group-item list-group-item-action list-group-item-light py-1"
                        key={idx + 1}
                        onClick={clicked}
                        id={item.name}>
                            {item.name}
                    </button>)
                }
            </div>
        </div>
    )
}

export default Clicklist