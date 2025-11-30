import React from 'react';
import {
  Github,
  Linkedin,
  Mail,
  PlayCircle,
  ExternalLink,
  Code2,
  Terminal,
  Monitor,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function Resume() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

        {/* Header / Hero Section */}
        <div className="bg-slate-900 text-white p-8 sm:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">PENG CHENG</h1>
              <h2 className="text-xl sm:text-2xl text-blue-400 font-medium">Solutions Architect (SA) at Alibaba Cloud | AI Developer</h2>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://www.linkedin.com/in/cheng-peng-30936a2a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/PCcoding666"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:e1143754@u.nus.edu"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Mail size={20} />
                <span>e1143754@u.nus.edu</span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-12">

          {/* Work Experience */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Work Experience</h3>
            </div>

            <div className="space-y-8 border-l-2 border-gray-200 ml-3 pl-8 relative">

              {/* Alibaba Cloud */}
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">Alibaba Cloud</h4>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Present</span>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Solutions Architect (SA)</p>
              </div>

              {/* Qoder */}
              <div className="relative">
                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-gray-400"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">Qoder</h4>
                  <span className="text-sm font-medium text-gray-500">2025</span>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-3">Brand Ambassador</p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Promoted the AI IDE "Qoder" by demonstrating full-cycle app development workflows. Produced technical content showcasing how to build a video generator app from scratch using AI.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=wbPEgh5lixw&t=334s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                >
                  <PlayCircle size={20} />
                  Watch Demo
                </a>
              </div>

            </div>
          </section>

          {/* Featured Projects */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                <Code2 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Featured Projects</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Project A: LCT */}
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3 text-indigo-600">
                  <Monitor size={20} />
                  <span className="font-semibold text-xs uppercase tracking-wider">AI Tool</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">On-Device Live Caption Translator (LCT)</h4>
                <p className="text-gray-600 mb-6 flex-grow">
                  A real-time live caption translator optimized for local inference on Intel Arc iGPU/NPU.
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href="https://lct-hub.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  >
                    Visit Site <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* Project B: VidSnap */}
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                  <Terminal size={20} />
                  <span className="font-semibold text-xs uppercase tracking-wider">Python & AI Agents</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">VidSnap (YouTube Summarizer)</h4>
                <p className="text-gray-600 mb-6 flex-grow">
                  An AI-powered tool to summarize YouTube videos efficiently.
                </p>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                  <a
                    href="https://vidsnap.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-800 transition-colors"
                  >
                    Visit Site <ExternalLink size={16} />
                  </a>
                  <a
                    href="https://github.com/PCcoding666/my_youtube_summarizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                  >
                    View Code <Github size={16} />
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* Past Internship Experience */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Internship Experience</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-1">Antalpha</h5>
                <p className="text-sm text-purple-600 font-medium">AI Product User Research Intern</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-1">HyperGAI</h5>
                <p className="text-sm text-purple-600 font-medium">Data Engineer Intern</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-1">Procter & Gamble (P&G)</h5>
                <p className="text-sm text-purple-600 font-medium">AI Engineer Intern</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Education</h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">National University of Singapore (NUS)</h4>
                  <p className="text-gray-600">Master's Degree</p>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <p className="text-gray-500 font-medium">Aug 2023 – Jan 2025</p>
                  <p className="text-amber-600 font-medium">GPA: 4.31/5.0</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">South China University of Technology (SCUT)</h4>
                  <p className="text-gray-600">Bachelor's Degree</p>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <p className="text-gray-500 font-medium">Aug 2019 – Jun 2023</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
