import React from 'react';
import { Shield, Sparkles, Phone, Mail, MapPin, Award } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Mission Card */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-605 flex items-center justify-center border border-purple-200/50 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md md:text-lg font-sans font-extrabold text-text-headline">
              About Health Care Hub (HCH)
            </h2>
            <span className="text-[9px] uppercase tracking-wider font-mono text-text-muted block">
              Regional Wellness Pilot System
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs md:text-sm text-text-body leading-relaxed">
            <strong>Pakistan HealthCare Hub (HCH)</strong> is dedicated to providing clinical-grade, accessible, and simple digital wellness tools. Our platform is specifically customized to support traditional Pakistani lifestyles, regional dietary recipes, chronic physical safety restrictions (such as knee-joint and spine pacing), and stress-relief breathing routines.
          </p>
          <p className="text-xs text-text-muted leading-relaxed italic">
            "Our ultimate goal is to bring health literacy and portion awareness to the everyday citizen (Aam Insaan), making healthy living straightforward, safe, and 100% free."
          </p>
        </div>
      </div>

      {/* Development Team Card */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-text-headline">
            Project Development Team
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { num: 1, name: "Muhammad Jamal", role: "Project Lead & Integration" },
            { num: 2, name: "Zainab Irfan", role: "UI/UX Design & Architecture" },
            { num: 3, name: "Laiba Khan", role: "Clinical Data Refiner" },
            { num: 4, name: "Aqsa Haider", role: "Frontend Developer" },
            { num: 5, name: "Ujala Ashraf", role: "Quality Assurance & Compliance" }
          ].map((dev) => (
            <div key={dev.num} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/70 hover:border-purple-300 transition duration-200 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-600 block">0{dev.num}</span>
              <h4 className="text-xs font-bold text-text-headline mt-1.5">{dev.name}</h4>
              <span className="text-[9.5px] text-text-muted block mt-0.5">{dev.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Helpline Card */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-text-headline">
            Support & Submission Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">Official Submission Helpline</span>
              <strong className="text-xs text-text-headline block mt-1">+92 309 4530756</strong>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">Email Contact</span>
              <strong className="text-xs text-text-headline block mt-1">support@healthcarehub.org</strong>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">regional pilot scope</span>
              <strong className="text-xs text-text-headline block mt-1">Karachi & Lahore, Pakistan</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
