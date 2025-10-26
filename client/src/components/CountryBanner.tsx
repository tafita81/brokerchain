import { COUNTRY_FLAGS, getFlagUrl } from "@/lib/i18n";

const COUNTRIES = [
  "USA", "Brazil", "China", "Australia", "Indonesia", 
  "Singapore", "Netherlands", "Switzerland"
] as const;

export function CountryBanner() {
  // Triplicate for seamless infinite loop (3 copies = -33.33% transform)
  const displayCountries = [...COUNTRIES, ...COUNTRIES, ...COUNTRIES];

  return (
    <div className="w-full overflow-hidden bg-muted/30 border-y border-border py-3" data-testid="country-banner">
      <div className="animate-scroll whitespace-nowrap">
        {displayCountries.map((country, index) => (
          <div 
            key={`${country}-${index}`}
            className="inline-flex items-center gap-2 px-4 mr-2"
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
