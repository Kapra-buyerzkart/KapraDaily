const getCategoryPlaceholder = name => {
  const lowerName = name?.toLowerCase() || '';
  if (lowerName.includes('fruit') || lowerName.includes('vegetable'))
    return require('../../../assets/images/categories/fnv.png');
  if (
    lowerName.includes('dairy') ||
    lowerName.includes('bread') ||
    lowerName.includes('egg')
  )
    return require('../../../assets/images/categories/cnb.png');
  if (lowerName.includes('tea') || lowerName.includes('coffee'))
    return require('../../../assets/images/categories/deb.png');
  if (lowerName.includes('dry') || lowerName.includes('nut'))
    return require('../../../assets/images/categories/dfn.png');
  if (lowerName.includes('fish') || lowerName.includes('meat'))
    return require('../../../assets/images/categories/fnm.png');
  if (lowerName.includes('snack'))
    return require('../../../assets/images/categories/sdj.png');
  if (lowerName.includes('drink') || lowerName.includes('juice'))
    return require('../../../assets/images/categories/snc.png');
  if (lowerName.includes('break') || lowerName.includes('cereal'))
    return require('../../../assets/images/categories/tcm.png');
  return require('../../../assets/images/categories/dfn.png'); // Default fallback
};

export default getCategoryPlaceholder;
