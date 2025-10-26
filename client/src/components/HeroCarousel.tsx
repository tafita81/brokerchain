import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Factory, Leaf, Recycle, CheckCircle2, Zap } from "lucide-react";
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
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <div className="space-y-8 text-white">
            {/* 🎯 TAGLINE REVOLUCIONÁRIO */}
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-full">
              <Recycle className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">World's First Circular Compliance Broker</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                <span className="text-white">Virgin + Secondary Materials,</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  All Certified for PFAS, Buy America & EUDR
                </span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                The only platform that combines <span className="font-semibold text-primary">Circular Economy</span> with <span className="font-semibold text-chart-2">Multi-Framework Compliance</span>. Buy verified primary or secondary materials, all certified across three regulatory domains.
              </p>
            </div>

            {/* 🔥 VALUE PROPS - ATENÇÃO EXTREMA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover-elevate transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Circular Economy</div>
                  <div className="text-sm text-white/70">Buy surplus certified materials at 30% discount</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover-elevate transition-all">
                <div className="w-10 h-10 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Triple Certification</div>
                  <div className="text-sm text-white/70">PFAS + Buy America + EUDR verified</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover-elevate transition-all">
                <div className="w-10 h-10 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">AI-Powered Matching</div>
                  <div className="text-sm text-white/70">Smart surplus-to-demand connections</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover-elevate transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Carbon Credits</div>
                  <div className="text-sm text-white/70">Earn credits on every circular transaction</div>
                </div>
              </div>
            </div>

            {/* 🚀 CTAs - ENGENHARIA DE ATENÇÃO */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard" data-testid="link-access-dashboard">
                <Button 
                  size="lg" 
                  className="gap-2 font-semibold text-lg h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50 animate-pulse" 
                  data-testid="button-access-dashboard"
                >
                  <Recycle className="w-5 h-5" />
                  Start Circular Sourcing
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/suppliers" data-testid="link-view-suppliers">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 font-semibold text-lg h-14 px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" 
                  data-testid="button-view-suppliers"
                >
                  Browse 600+ Suppliers
                </Button>
              </Link>
            </div>

            {/* 🏆 TRUST INDICATORS - HIPNOSE DE AUTORIDADE */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">NMSDC Certified MBE</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Factory className="w-5 h-5 text-chart-2" />
                <span className="font-medium">SAM.gov Registered</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Leaf className="w-5 h-5 text-chart-3" />
                <span className="font-medium">SPC Member</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Recycle className="w-5 h-5 text-primary" />
                <span className="font-medium">Ellen MacArthur Network</span>
              </div>
            </div>
          </div>

          {/* Right: Stats Card - URGÊNCIA E SOCIAL PROOF */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-white">$12.4M+</div>
                <div className="text-sm text-white/70">Circular Materials Traded</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">600+</div>
                  <div className="text-xs text-white/70">Verified Suppliers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">14</div>
                  <div className="text-xs text-white/70">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">3</div>
                  <div className="text-xs text-white/70">Frameworks</div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>30% avg discount on surplus materials</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>AI matches in under 2 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Carbon credits auto-generated</span>
                </div>
              </div>

              {/* 🔥 URGÊNCIA - MENSAGEM SUBLIMINAR */}
              <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 text-center">
                <div className="text-sm font-semibold text-primary mb-1">⚡ Limited Time</div>
                <div className="text-xs text-white/80">First 100 suppliers get free carbon credit tracking</div>
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
