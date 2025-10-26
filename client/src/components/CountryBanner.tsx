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
      <div className="flex animate-marquee whitespace-nowrap">
        {displayCountries.map((country, index) => (
          <div 
            key={`${country}-${index}`}
            className="inline-flex items-center gap-2 mx-6"
          >
            <img
              src={getFlagUrl(country)}
              alt={`${country} flag`}
              className="w-7 h-5 object-cover rounded-sm shadow-sm inline-block"
            />
            <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider inline-block">
              {country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
