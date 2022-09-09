import React from 'react';

const Clicklist = props => {

    const clicked = e => {
        e.preventDefault();
        console.log('props: ' + props.items.name);
        console.log('clicky: ' + e.target.id);
        props.clicked(e.target);
    }
    return (
        <div className="list-group">
            {
                props.items.map((item, idx) => 
                <button key={idx}
                    onClick={clicked}
                    id={item.name}>
                        {item.name}
                </button>)
            }
        </div>
    )
}

export default Clicklist