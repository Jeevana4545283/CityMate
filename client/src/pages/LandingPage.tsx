import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Building,
  Wrench,
  Trophy,
  Users,
  MessageSquare,
  MapPin,
  ArrowRight,
  Shield,
  Zap,
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const howItWorks = [
    {
      step: '01',
      title: 'Choose Your City',
      description: 'Tell CityMate where you are located. We customize everything to your neighborhood.',
      icon: MapPin
    },
    {
      step: '02',
      title: 'Discover',
      description: 'Find verified PGs, flats, local handymen, sports players, and emergency spots near you.',
      icon: Compass
    },
    {
      step: '03',
      title: 'Connect',
      description: 'Chat directly with property owners, local handymen, and potential badminton partners.',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Book & Participate',
      description: 'Book home repair technicians, join weekend badminton doubles, and participate in events.',
      icon: Wrench
    },
    {
      step: '05',
      title: 'Belong',
      description: 'Join local communities, ask city questions, and turn an unfamiliar city into your home.',
      icon: HeartHandshake
    }
  ];

  const whyCityMateCards = [
    {
      icon: Building,
      title: 'Find a Place',
      description: 'Discover verified PGs, hostels, flats, and compatible roommates within your budget.',
      tag: 'Homes'
    },
    {
      icon: Users,
      title: 'Find People',
      description: 'Meet like-minded newcomers, flatmates, and friends in your locality.',
      tag: 'Social'
    },
    {
      icon: Wrench,
      title: 'Find Services',
      description: 'Book verified electricians, plumbers, fan repairers, and AC technicians in minutes.',
      tag: 'Handymen'
    },
    {
      icon: Trophy,
      title: 'Find Sports Partners',
      description: 'Connect with nearby badminton, cricket, and football players with smart match scoring.',
      tag: 'Sports'
    },
    {
      icon: Compass,
      title: 'Explore the City',
      description: 'Locate nearby cafes, gymnasiums, transport hubs, and student-friendly hangouts.',
      tag: 'Explore'
    },
    {
      icon: HeartHandshake,
      title: 'Join Communities',
      description: 'Be part of active local groups like Hyderabad Newcomers and developers forums.',
      tag: 'Community'
    },
    {
      icon: MessageSquare,
      title: 'Ask Locals',
      description: 'Get real answers from locals about affordable areas, safety, and trusted services.',
      tag: 'Q&A'
    },
    {
      icon: MapPin,
      title: 'Discover Nearby',
      description: 'Find 24/7 emergency hospitals, pharmacies, ATMs, and grocery stores instantly.',
      tag: 'Essentials'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-bold mb-6">
            <Zap className="w-3.5 h-3.5 fill-neutral-900" />
            <span>All-in-One New City Life Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 max-w-4xl mx-auto leading-tight mb-6">
            New city? New life.{' '}
            <span className="underline decoration-neutral-900 underline-offset-8">
              We&apos;ve got you covered.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Arrive anywhere. Find everything. Connect with everyone.
            <br className="hidden sm:inline" /> Find PGs, roommates, local handymen, badminton partners, and communities from one digital companion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm flex items-center justify-center space-x-2 group transition-all"
            >
              <span>Explore Your City</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Get Started Free</span>
            </Link>
          </div>

          {/* Interactive Hero Feature Preview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-200">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-900 border border-neutral-200 flex items-center justify-center mb-3">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900">Find a PG / Flat</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Gachibowli PGs under ₹10k</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-200">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-900 border border-neutral-200 flex items-center justify-center mb-3">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900">Need a Service</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Fan repair, electrician in 30m</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-200">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-900 border border-neutral-200 flex items-center justify-center mb-3">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900">Sports Matching</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">94% Match for Badminton</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-200">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-900 border border-neutral-200 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900">City Communities</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Hyderabad Newcomers Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* How CityMate Works Section */}
      <section className="py-20 bg-neutral-100 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Simple & Intuitive Journey</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900">How CityMate Works</h3>
            <p className="text-neutral-600 text-xs sm:text-sm mt-2">
              From the moment you set foot in an unfamiliar city, we guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-neutral-300 group-hover:text-neutral-900 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why CityMate? Section */}
      <section className="py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Everything You Need</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900">Why CityMate?</h3>
            <p className="text-neutral-600 text-xs sm:text-sm mt-2">
              Not just a PG finder, handyman app, or social network — your complete digital companion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCityMateCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase tracking-wider border border-neutral-200">
                        {card.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-neutral-900 mb-1.5 group-hover:text-neutral-700 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Primary Call To Action Banner */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-16 rounded-3xl border border-neutral-200 text-center shadow-2xs">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-4">
              Stop Feeling Like a Stranger in Your New City.
            </h2>
            <p className="text-neutral-600 text-sm max-w-xl mx-auto mb-8">
              Join thousands of students, professionals, and newcomers who found their home, partners, handymen, and community on CityMate.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm text-sm transition-all"
            >
              <span>Get Started Now — It&apos;s Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
