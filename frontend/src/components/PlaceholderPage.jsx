import React from 'react';
import Card from '../components/Card';

const PlaceholderPage = ({ title, icon }) => {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
                    <p className="text-sm text-slate-500">Manage and view {title.toLowerCase()} information.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    Add New
                </button>
            </div>

            <Card className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{title} Module</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    This section is currently under construction. Data tables, forms, and advanced features for {title.toLowerCase()} will be implemented here.
                </p>
                <div className="flex gap-4">
                    <button className="btn-primary">View Documentation</button>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">Go Back</button>
                </div>
            </Card>
        </div>
    );
};

export default PlaceholderPage;
