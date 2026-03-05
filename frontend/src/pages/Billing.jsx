import React from 'react';
import Card from '../components/Card';
import { Timer } from 'lucide-react';

const Billing = () => {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
            <Card className="max-w-md w-full text-center py-16 shadow-xl border-t-8 border-t-amber-500">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-amber-100 rounded-full animate-bounce">
                        <Timer className="text-amber-600" size={48} />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-slate-800 uppercase tracking-widest">Coming Soon</h1>
                <p className="text-slate-500 font-medium mt-4">Sidaad dalbatay, page-kan waa "Coming Soon".</p>
            </Card>
        </div>
    );
};
export default Billing;
