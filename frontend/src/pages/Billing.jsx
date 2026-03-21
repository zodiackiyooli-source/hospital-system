import React from "react";
import Card from "../components/Card";
import { Timer } from "lucide-react";

const Billing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-100 p-6">
      
      <Card className="max-w-lg w-full backdrop-blur-lg bg-white/70 border border-white/40 shadow-2xl rounded-3xl text-center py-16 px-8 transition-all duration-300 hover:scale-105">

        <div className="flex justify-center mb-6">
          <div className="p-6 bg-amber-100 rounded-full shadow-md animate-pulse">
            <Timer className="text-amber-600" size={50} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-wider">
          Coming Soon
        </h1>

        <p className="text-slate-500 mt-4 text-lg">
          Billing system-ka wali waa la dhisayaa.  
          Wax yar kadib ayuu diyaar noqon doonaa.
        </p>

        <div className="mt-8">
          <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-bg-700 font-semibold rounded-xl shadow-lg transition duration-300">
            Notify Me
          </button>
        </div>

      </Card>

    </div>
  );
};

export default Billing;