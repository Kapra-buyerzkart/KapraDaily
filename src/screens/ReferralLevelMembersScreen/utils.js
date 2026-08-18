export const formatDate = dateString => {
  if (!dateString) return '';
  const [date] = dateString.split('T');
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

export const initialOf = name => (name || 'U').charAt(0).toUpperCase();

export const extractMembers = data => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.members)) return data.members;
  if (Array.isArray(data.items)) return data.items;
  return [];
};
