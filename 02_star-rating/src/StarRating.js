import React, { useState } from 'react';
import Star from './Star';

export default function StarRating({ totalStars = 5, style = {}, ...props }) {
    const [selectedStars, setSelectedStars] = useState(2);

    return (
        <div style={{ ...style, padding: '25px' }} {...props}>
            {[...Array(totalStars)].map((_, i) => {
                return (
                    <Star
                        key={i}
                        selected={selectedStars > i}
                        onSelect={() => setSelectedStars(i + 1)}
                    />
                );
            })}
            <p>
                {selectedStars} of {totalStars}
            </p>
        </div>
    );
}
