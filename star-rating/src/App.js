import React from 'react';
import StarRating from './StarRating';

export default function App() {
    return (
        <>
            <StarRating
                totalStars={10}
                style={{ backgroundColor: 'lightblue' }}
                onDoubleClick={(e) => alert('double click')}
            />
        </>
    );
}
