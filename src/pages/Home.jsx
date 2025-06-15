import React from 'react';
import { User, GraduationCap, Shield } from 'lucide-react';
import { Link } from 'react-router';




export default function Home () {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full text-center">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Project Management System 
          </h1>
          <div className="max-w-4xl mx-auto text-white/90 text-lg md:text-xl leading-relaxed space-y-4">
            <p>
              The Student Project Management System is a comprehensive platform designed to streamline the graduation project workflow for students, teachers, and administrators.
            </p>
            <p>
              This system facilitates project idea submission, approval processes, team management, and provides role-based access control to ensure efficient project supervision.
            </p>
            <p>
              Built with modern web technologies, it offers an intuitive interface for managing student projects from conception to completion.
            </p>
          </div>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Student Card */}
          <Link to="/user/" className="group block">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center group-hover:from-emerald-300 group-hover:to-teal-400 transition-all duration-300">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Student Portal</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Submit project ideas, view approved projects, track status, and collaborate with team members
                  </p>
                </div>
                <div className="w-full pt-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300">
                    Enter as Student
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Teacher Card */}
          <Link to="/teacher/" className="group block">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center group-hover:from-orange-300 group-hover:to-red-400 transition-all duration-300">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Teacher Portal</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Supervise students, review project proposals, approve or reject ideas with feedback
                  </p>
                </div>
                <div className="w-full pt-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300">
                    Enter as Teacher
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link to="/admin/login" className="group block">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:from-purple-300 group-hover:to-pink-400 transition-all duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Admin Portal</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Manage all users, oversee projects, assign teachers to students, and system administration
                  </p>
                </div>
                <div className="w-full pt-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    Enter as Admin
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-white/70 text-sm">
          <p>Built for efficient project management and academic excellence</p>
        </div>
      </div>
    </div>
  );
};

