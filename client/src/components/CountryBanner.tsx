import { COUNTRY_FLAGS, getFlagUrl } from "@/lib/i18n";

const COUNTRIES = [
  "USA", "Brazil", "China", "Australia", "Indonesia", 
  "Singapore", "Netherlands", "Switzerland"
] as const;

export function CountryBanner() {
  // Duplicate countries 2x for seamless infinite scroll
  const allCountries = [...COUNTRIES, ...COUNTRIES];

  return (
    <div className="w-full overflow-x-hidden bg-muted/30 border-y border-border py-4" data-testid="country-banner">
      <div className="animate-scroll">
        {allCountries.map((country, index) => (
          <div 
            key={`${country}-${index}`}
            className="inline-flex items-center gap-3 px-6 flex-shrink-0"
          >
            <img
              src={getFlagUrl(country)}
              alt={`${country} flag`}
              className="w-8 h-6 object-cover rounded-sm shadow-sm"
            />
            <span className="font-mono text-sm font-semibold text-foreground whitespace-nowrap">
              {country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
