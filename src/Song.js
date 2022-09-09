import React from 'react';

const Song = ({album, artists, name}) => {
    return (
        <div>
            <div>
                <img
                    src={album.images[0].url}
                    alt={name}/>
            </div>
            <div>
                <label htmlFor={name}/>
                {name}
            </div>
            <div>
                <label htmlFor={artists[0].name}/>
                {artists[0].name}
            </div>
        </div>

    )
}

export default Song;