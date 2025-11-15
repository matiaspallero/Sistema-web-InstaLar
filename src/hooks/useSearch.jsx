import { useState, useMemo } from 'react';

export function useSearch(data, searchKeys) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item => {
      return searchKeys.some(key => {
        const value = key.split('.').reduce((obj, k) => obj?.[k], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  return { searchTerm, setSearchTerm, filteredData };
}