import { COUNTRY_FLAGS, getFlagUrl } from "@/lib/i18n";

const COUNTRIES = [
  "USA", "Brazil", "China", "Australia", "Indonesia", 
  "Singapore", "Netherlands", "Switzerland"
] as const;

export function CountryBanner() {
  // Duplicate for seamless loop
  const displayCountries = [...COUNTRIES, ...COUNTRIES];

  return (
    <div className="relative w-full overflow-hidden bg-muted/30 border-y border-border py-3" data-testid="country-banner">
      <div className="flex animate-marquee gap-8">
        {displayCountries.map((country, index) => (
          <div 
            key={`${country}-${index}`}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-5 py-2.5 flex-shrink-0 whitespace-nowrap"
          >
            <img
              src={getFlagUrl(country)}
              alt={`${country} flag`}
              className="w-7 h-5 object-cover rounded-sm shadow-sm flex-shrink-0"
            />
            <span className="font-mono text-sm font-bold text-foreground uppercase tracking-wide flex-shrink-0">
              {country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
