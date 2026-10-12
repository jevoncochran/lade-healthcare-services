"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import InputField from "@/components/form/InputField";
import { api } from "@/lib/api";
import type { Address } from "@/lib/booking";

type Suggestion = { placeId: string; label: string };

const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;

// The street address field with suggestions as you type (Amazon Location
// Service, through our API). Picking one fills in the street, city, state
// and ZIP fields of the same address; everything stays editable. If the API
// has no autofill configured, this behaves like a plain text field.
//
// Follows the ARIA combobox pattern: ↑/↓ to move, Enter to pick, Esc to close.
const AddressAutocomplete = ({
  prefix,
  defaultValue,
  error,
}: {
  prefix: "pickup" | "dropoff";
  defaultValue?: string;
  error?: string;
}) => {
  const name = `${prefix}Line1`;
  const listId = `${prefix}-suggestions`;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  // Turns itself off for the visit if the API says autofill isn't set up.
  const [available, setAvailable] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef("");

  useEffect(() => () => clearTimeout(timer.current), []);

  const fetchSuggestions = (query: string) => {
    clearTimeout(timer.current);
    if (!available || query.trim().length < MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    // Wait for a pause in typing: fewer (paid) lookups.
    timer.current = setTimeout(async () => {
      latest.current = query;
      const result = await api<{ available: boolean; suggestions: Suggestion[] }>(
        `/addresses/suggest?q=${encodeURIComponent(query.trim())}`,
      );
      if (latest.current !== query) return; // a newer search is on its way
      if (!result.ok) return; // just no suggestions this time
      if (!result.data.available) {
        setAvailable(false);
        return;
      }
      setSuggestions(result.data.suggestions);
      setActive(-1);
      setOpen(result.data.suggestions.length > 0);
    }, DEBOUNCE_MS);
  };

  const pick = async (suggestion: Suggestion) => {
    setOpen(false);
    setSuggestions([]);
    const result = await api<Address>(
      `/addresses/places/${encodeURIComponent(suggestion.placeId)}`,
    );
    const fill = (field: string, value: string) => {
      const input = document.getElementById(`${prefix}${field}`) as
        | HTMLInputElement
        | null;
      if (input) input.value = value;
    };
    if (result.ok) {
      fill("Line1", result.data.line1);
      fill("City", result.data.city);
      fill("State", result.data.state);
      fill("Zip", result.data.zip);
      document.getElementById(`${prefix}Line2`)?.focus(); // apartment/suite next
    } else {
      // Not a complete street address: keep the street part, they finish it.
      fill("Line1", suggestion.label.split(",")[0]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault(); // pick, don't submit the form
      void pick(suggestions[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <InputField
        name={name}
        label="Street address"
        hint={available ? "Start typing and choose your address from the list." : undefined}
        autoComplete="off"
        required
        defaultValue={defaultValue}
        error={error}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(event) => fetchSuggestions(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute inset-x-0 z-20 mt-1 overflow-hidden rounded-button border border-line bg-white shadow-card"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.placeId}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // mousedown, not click: runs before the input's blur closes the list
              onMouseDown={(event) => {
                event.preventDefault();
                void pick(suggestion);
              }}
              className={`cursor-pointer px-4 py-3 text-sm text-ink ${
                index === active ? "bg-secondary/10" : "hover:bg-surface"
              }`}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
