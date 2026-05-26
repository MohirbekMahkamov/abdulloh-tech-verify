export function isValidEAN13(code: string): boolean {
  if (!code || !/^\d{13}$/.test(code)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(code[12], 10);
}

export function parseSpecs(specsString: string): Record<string, any> {
  try {
    return JSON.parse(specsString);
  } catch (e) {
    const mockRecord: Record<string, any> = {};
    if (specsString.includes(':')) {
      specsString.split(',').forEach(item => {
        const parts = item.split(':');
        if (parts.length >= 2) {
          mockRecord[parts[0].trim()] = parts[1].trim();
        }
      });
    } else {
      mockRecord['Xususiyatlar'] = specsString;
    }
    return mockRecord;
  }
}

// Automatically generates a valid EAN-13 barcode string
export function generateEAN13(): string {
  // Prefix for Uzbekistan: 478
  // Generate next 9 random digits
  let codeWithoutCheckDigit = '478';
  for (let i = 0; i < 9; i++) {
    codeWithoutCheckDigit += Math.floor(Math.random() * 10).toString();
  }
  
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(codeWithoutCheckDigit[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return codeWithoutCheckDigit + checkDigit.toString();
}

// EAN-13 Binary pattern generator for drawing vector barcode lines
export function getEAN13BinaryPattern(code: string): string {
  if (!/^\d{13}$/.test(code)) {
    return '';
  }

  const L = [
    "0001101", "0011001", "0010011", "0111101", "0100011",
    "0110001", "0101111", "0111011", "0110111", "0001011"
  ];

  const G = [
    "0100111", "0110011", "0011011", "0100001", "0011101",
    "0111001", "0000101", "0010001", "0001001", "0010111"
  ];

  const R = [
    "1110010", "1100110", "1101100", "1000010", "1011100",
    "1001110", "1010000", "1000100", "1001000", "1110100"
  ];

  const parityPatterns = [
    "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
    "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGGLG"
  ];

  const firstDigit = parseInt(code[0], 10);
  const pattern = parityPatterns[firstDigit];

  let binary = '';

  // Left guard
  binary += '101';

  // Left 6 digits
  for (let i = 1; i <= 6; i++) {
    const digit = parseInt(code[i], 10);
    const type = pattern[i - 1];
    if (type === 'L') {
      binary += L[digit];
    } else {
      binary += G[digit];
    }
  }

  // Center guard
  binary += '01010';

  // Right 6 digits
  for (let i = 7; i <= 12; i++) {
    const digit = parseInt(code[i], 10);
    binary += R[digit];
  }

  // Right guard
  binary += '101';

  return binary;
}
