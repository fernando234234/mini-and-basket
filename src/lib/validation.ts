/**
 * Validation utilities for Italian forms
 */

/**
 * Validates Italian phone numbers
 * 
 * Accepts formats:
 * - Mobile: +39 3XX XXX XXXX or 3XXXXXXXXX
 * - Landline: +39 0X XXXX XXXX or 0XXXXXXXXX
 * - With or without spaces/dashes
 * 
 * @param phone - The phone number to validate
 * @returns true if valid Italian phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove spaces, dashes, dots
  const cleaned = phone.replace(/[\s\-\.]/g, '');
  
  // If empty, let required validation handle it
  if (!cleaned) return true;
  
  // Italian phone patterns
  // Mobile: 3XX followed by 6-7 digits (with or without +39)
  // Landline: 0X followed by 6-9 digits (with or without +39)
  const mobilePattern = /^(\+39)?3\d{8,9}$/;
  const landlinePattern = /^(\+39)?0\d{6,10}$/;
  
  return mobilePattern.test(cleaned) || landlinePattern.test(cleaned);
};

/**
 * Validates Italian Codice Fiscale (tax code)
 * 
 * Format: AAABBB00A00A000A (16 characters)
 * - 6 letters (surname + name)
 * - 2 digits (year)
 * - 1 letter (month: A=Jan, B=Feb, C=Mar, D=Apr, E=May, H=Jun, L=Jul, M=Aug, P=Sep, R=Oct, S=Nov, T=Dec)
 * - 2 digits (day: 1-31 for males, 41-71 for females)
 * - 1 letter + 3 digits (comune code)
 * - 1 letter (check character)
 * 
 * @param cf - The codice fiscale to validate
 * @returns true if valid Italian codice fiscale
 */
export const validateCodiceFiscale = (cf: string): boolean => {
  // If empty, let required validation handle it
  if (!cf) return true;
  
  // Must be exactly 16 characters
  if (cf.length !== 16) return false;
  
  // Convert to uppercase
  const cfUpper = cf.toUpperCase();
  
  // Pattern: 6 letters, 2 digits, 1 letter, 2 digits, 1 letter, 3 digits, 1 letter
  const pattern = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
  
  if (!pattern.test(cfUpper)) return false;
  
  // Validate month letter (A,B,C,D,E,H,L,M,P,R,S,T)
  const monthLetter = cfUpper.charAt(8);
  const validMonths = 'ABCDEHLMPRST';
  if (!validMonths.includes(monthLetter)) return false;
  
  // Validate day (01-31 for males, 41-71 for females)
  const day = parseInt(cfUpper.substring(9, 11), 10);
  if (!((day >= 1 && day <= 31) || (day >= 41 && day <= 71))) return false;
  
  return true;
};

/**
 * Error messages for validation
 */
export const validationMessages = {
  phoneInvalid: 'Inserisci un numero di telefono italiano valido (es. 333 1234567)',
  codiceFiscaleInvalid: 'Inserisci un codice fiscale valido (16 caratteri alfanumerici)',
};