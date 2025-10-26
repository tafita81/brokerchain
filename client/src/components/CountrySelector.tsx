import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { COUNTRY_FLAGS, getFlagUrl } from "@/lib/i18n";

const COUNTRIES = [
  "USA", "Canada", "UK", "Germany", "France", "Italy", "Spain",
  "Japan", "Australia", "Brazil", "Mexico", "Netherlands", "Singapore", "UAE", "China"
] as const;

export function CountrySelector() {
  const { country, setCountry, t } = useLanguage();

  return (
    <Select value={country} onValueChange={setCountry}>
      <SelectTrigger data-testid="select-country" className="w-[220px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <img
              src={getFlagUrl(country as keyof typeof COUNTRY_FLAGS)}
              alt={`${country} flag`}
              className="w-6 h-4 object-cover rounded-sm"
            />
            <span>{country}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c} value={c} data-testid={`country-option-${c}`}>
            <div className="flex items-center gap-2">
              <img
                src={getFlagUrl(c)}
                alt={`${c} flag`}
                className="w-6 h-4 object-cover rounded-sm"
              />
              <span>{c}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
