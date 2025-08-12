// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete#value
export type NamedGroup = `section-${string}`;

export type GroupingIdentifier = "shipping" | "billing";

type RecipientType = "home" | "work" | "mobile" | "fax" | "page";
type DigitalContact =
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-extension"
  | "email"
  | "impp";
type RecipientTypeWithDigitalContact = `${RecipientType} ${DigitalContact}`;

type OtherTokens =
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization-title"
  | "organization"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "url"
  | "photo";

type DetailToken = RecipientTypeWithDigitalContact | OtherTokens;

export type Autocomplete =
  | "off"
  | "on"
  | DetailToken
  | `${NamedGroup} ${DetailToken}`
  | `${GroupingIdentifier} ${DetailToken}`
  | `${NamedGroup} ${GroupingIdentifier} ${DetailToken}`;

export const typecheckAutocomplete = (autocomplete: Autocomplete) => {
  return autocomplete;
};
