import { Calendar, Clock, Bell, Sparkles } from 'lucide-react';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-mesh opacity-30 animate-pulse-slow pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white px-6 py-10 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 animate-float">
              <Calendar className="w-12 h-12" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-1">Schedule</h1>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <p className="text-xl opacity-95">Smart medication reminders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-10 relative z-10">
        <div className="text-center py-20">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative glass border-4 border-white/50 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl">
              <Calendar className="w-16 h-16 text-purple-600" strokeWidth={2.5} />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-5">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
            Set intelligent reminders for your medications and never miss a dose
          </p>
          
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative glass border-2 border-white/50 rounded-3xl p-10 max-w-md mx-auto shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-5 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-md opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Clock className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-800 text-left">
                    Daily medication reminders
                  </p>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                
                <div className="flex items-center gap-5 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-md opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Bell className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-800 text-left">
                    Smart notifications
                  </p>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                
                <div className="flex items-center gap-5 group/item">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-md opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg group-hover/item:scale-110 transition-transform">
                      <Calendar className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-800 text-left">
                    Refill tracking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-dark border-2 border-white/30 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-gray-600 text-lg">
              This feature is under development and will be available in a future update
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
