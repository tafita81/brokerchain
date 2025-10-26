import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Factory, Leaf, Recycle, CheckCircle2, Zap, Globe } from "lucide-react";
import { Link } from "wouter";

// Import stock images
import sustainableImg1 from '@assets/stock_images/sustainable_packagin_e77be9fd.jpg';
import sustainableImg2 from '@assets/stock_images/sustainable_packagin_c7242f24.jpg';
import sustainableImg3 from '@assets/stock_images/sustainable_packagin_854394b8.jpg';
import industrialImg1 from '@assets/stock_images/industrial_manufactu_5a4ac1cc.jpg';
import industrialImg2 from '@assets/stock_images/industrial_manufactu_cb33623d.jpg';
import industrialImg3 from '@assets/stock_images/industrial_manufactu_04330c4d.jpg';
import agricultureImg1 from '@assets/stock_images/agricultural_commodi_65d8217e.jpg';
import agricultureImg2 from '@assets/stock_images/agricultural_commodi_34bcb230.jpg';
import agricultureImg3 from '@assets/stock_images/agricultural_commodi_39f456bb.jpg';

const BACKGROUND_IMAGES = [
  sustainableImg1, sustainableImg2, sustainableImg3,
  industrialImg1, industrialImg2, industrialImg3,
  agricultureImg1, agricultureImg2, agricultureImg3
];

export function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">
      {/* Background Carousel with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 min-h-[90vh] flex items-center">
        <div className="w-full">
          {/* Content */}
          <div className="max-w-5xl mx-auto space-y-8 text-white">
            <div className="space-y-6">
              {/* 🎯 TAGLINE REVOLUCIONÁRIO - DOURADO GIGANTE */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-yellow-200/30 via-yellow-300/20 to-amber-200/30 backdrop-blur-sm border-2 border-yellow-300/40 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Recycle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-yellow-200" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-none text-yellow-200 drop-shadow-[0_2px_10px_rgba(252,211,77,0.5)] whitespace-nowrap">
                    World's First Circular Compliance Broker
                  </h2>
                </div>
                
                {/* 🌍 GLOBAL PRESENCE BADGES */}
                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-16 md:pl-20 lg:pl-24">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <Globe className="w-4 h-4 text-blue-300" />
                    <span className="text-xs sm:text-sm font-bold text-white">14 Countries</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <img src="https://flagcdn.com/us.svg" alt="USA" className="w-6 h-4 object-cover rounded" />
                    <span className="text-xs font-semibold text-white/80">USA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <img src="https://flagcdn.com/de.svg" alt="Germany" className="w-6 h-4 object-cover rounded" />
                    <span className="text-xs font-semibold text-white/80">Germany</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <img src="https://flagcdn.com/cn.svg" alt="China" className="w-6 h-4 object-cover rounded" />
                    <span className="text-xs font-semibold text-white/80">China</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <img src="https://flagcdn.com/br.svg" alt="Brazil" className="w-6 h-4 object-cover rounded" />
                    <span className="text-xs font-semibold text-white/80">Brazil</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <img src="https://flagcdn.com/in.svg" alt="India" className="w-6 h-4 object-cover rounded" />
                    <span className="text-xs font-semibold text-white/80">India</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <span className="text-xs font-semibold text-white/60">+8 more</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-white">Virgin + Secondary Materials,</span>
                <br />
                <span className="text-white">All Certified for </span>
                <span className="text-blue-400">PFAS</span>
                <span className="text-white">, </span>
                <span className="text-green-400">Buy America</span>
                <span className="text-white"> & </span>
                <span className="text-orange-400">EUDR</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl">
                The only platform that combines <span className="font-semibold text-blue-400">Circular Economy</span> with <span className="font-semibold text-green-400">Multi-Framework Compliance</span>. Buy verified primary or secondary materials, all certified across three regulatory domains.
              </p>
            </div>

            {/* 🔥 VALUE PROPS - ATENÇÃO EXTREMA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
              <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover-elevate transition-all text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-7 h-7 text-blue-300" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-2">Circular Economy</div>
                  <div className="text-sm text-white/80 leading-relaxed">Buy surplus certified materials at 30% discount</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover-elevate transition-all text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-green-300" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-2">Triple Certification</div>
                  <div className="text-sm text-white/80 leading-relaxed">PFAS + Buy America + EUDR verified</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover-elevate transition-all text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-7 h-7 text-orange-300" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-2">AI-Powered Matching</div>
                  <div className="text-sm text-white/80 leading-relaxed">Smart surplus-to-demand connections</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover-elevate transition-all text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/30 to-amber-600/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-7 h-7 text-yellow-300" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-2">Carbon Credits</div>
                  <div className="text-sm text-white/80 leading-relaxed">Earn credits on every circular transaction</div>
                </div>
              </div>
            </div>

            {/* 🚀 CTAs - ENGENHARIA DE ATENÇÃO */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/dashboard" data-testid="link-access-dashboard" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-3 font-bold text-lg md:text-xl h-16 md:h-18 px-10 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 shadow-2xl shadow-blue-500/50 animate-pulse border-2 border-blue-400/30" 
                  data-testid="button-access-dashboard"
                >
                  <Recycle className="w-6 h-6 md:w-7 md:h-7" />
                  Start Circular Sourcing
                  <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
                </Button>
              </Link>
              <Link href="/suppliers" data-testid="link-view-suppliers" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto gap-3 font-bold text-lg md:text-xl h-16 md:h-18 px-10 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60" 
                  data-testid="button-view-suppliers"
                >
                  Browse 600+ Suppliers
                </Button>
              </Link>
            </div>

            {/* 🏆 TRUST INDICATORS - HIPNOSE DE AUTORIDADE */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2 text-white bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-300 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base">NMSDC Certified MBE</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Factory className="w-5 h-5 md:w-6 md:h-6 text-green-300 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base">SAM.gov Registered</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 text-orange-300 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base">SPC Member</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Recycle className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base">Ellen MacArthur</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🎯 CAROUSEL INDICATORS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {BACKGROUND_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImageIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
