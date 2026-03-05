import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-surface rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md ${className}`}>
            {children}
        </div>
    );
};

export default Card;
