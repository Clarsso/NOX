const SIZE_ORDER: Record<string, number> = {
  'XXS': 1,
  'XS': 2,
  'S': 3,
  'CH': 3,
  'M': 4,
  'MED': 4,
  'L': 5,
  'G': 5,
  'XL': 6,
  'EG': 6,
  '2XL': 7,
  'XXL': 7,
  '3XL': 8,
  'XXXL': 8,
  '4XL': 9,
};

export const sortSizes = (sizes: string[] = []): string[] => {
  return [...sizes].sort((a, b) => {
    const cleanA = a.trim().toUpperCase();
    const cleanB = b.trim().toUpperCase();

    const orderA = SIZE_ORDER[cleanA];
    const orderB = SIZE_ORDER[cleanB];

    // 1. Jerarquía textil
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }

    // 2. Números (Anillos: 7, 8, 9, 10...)
    const numA = parseFloat(cleanA);
    const numB = parseFloat(cleanB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    // 3. Volúmenes (Perfumes: 30ml, 50ml, 100ml)
    const volA = parseInt(cleanA.replace(/\D/g, ''), 10);
    const volB = parseInt(cleanB.replace(/\D/g, ''), 10);
    if (!isNaN(volA) && !isNaN(volB) && volA !== volB) {
      return volA - volB;
    }

    // 4. Orden alfabético
    return cleanA.localeCompare(cleanB);
  });
};