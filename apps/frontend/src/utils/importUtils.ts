export const parseCSV = async (csvInput: string | File): Promise<any[]> => {
  let csvContent: string;
  
  if (csvInput instanceof File) {
    csvContent = await csvInput.text();
  } else {
    csvContent = csvInput;
  }
  
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

export const validateCSVFormat = (headers: string[], requiredFields: string[]): boolean => {
  return requiredFields.every(field => headers.includes(field));
};
