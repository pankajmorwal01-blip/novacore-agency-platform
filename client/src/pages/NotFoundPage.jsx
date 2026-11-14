import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-white text-slate-900">
      <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 shadow-xs">
        <span className="font-serif text-2xl font-bold text-accent">404</span>
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-8">
        The requested page does not exist or has been relocated to another subsystem.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
