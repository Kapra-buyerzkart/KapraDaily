import icons from '@/assets/icons';

/**
 * Maps category names to the newly added tab icons in assets.
 * Exactly matches the design reference:
 * - "All" -> basket icon (tabBasket / shopping-basket copy 1.png)
 * - "Home essentials" -> cleaning icon (tabCleaning / shopping-basket copy 4.png)
 * - "Staples & more" -> bento with sprout leaves (tabStaples / shopping-basket copy 3.png)
 * - "Fruits & vegetables" -> fruits & veg icon (tabFruits / shopping-basket copy 2.png)
 * - Plus smart fallbacks for snacks, drinks, personal care, stationery
 */
export const getCategoryTabIcon = (catName = '', isActive = false) => {
  const name = (catName || '').toLowerCase().trim();
  if (!name || name === 'all') {
    return isActive ? (icons.tabBasketFilled || icons.tabBasket) : icons.tabBasket;
  }

  if (
    name.includes('clean') ||
    name.includes('essential') ||
    name.includes('house') ||
    name.includes('detergent') ||
    name.includes('laundry')
  ) {
    return isActive ? (icons.tabCleaningFilled || icons.tabCleaning) : icons.tabCleaning;
  }
  if (
    name.includes('staple') ||
    name.includes('atta') ||
    name.includes('rice') ||
    name.includes('dal') ||
    name.includes('grain') ||
    name.includes('oil') ||
    name.includes('masala') ||
    name.includes('spice') ||
    name.includes('flour')
  ) {
    return isActive ? (icons.tabStaplesFilled || icons.tabStaples) : icons.tabStaples;
  }
  if (
    name.includes('fruit') ||
    name.includes('veg') ||
    name.includes('fresh') ||
    name.includes('produce')
  ) {
    return isActive ? (icons.tabFruitsFilled || icons.tabFruits) : icons.tabFruits;
  }
  if (
    name.includes('snack') ||
    name.includes('chip') ||
    name.includes('biscuit') ||
    name.includes('munch') ||
    name.includes('namkeen') ||
    name.includes('cookie') ||
    name.includes('sweet')
  ) {
    return isActive ? (icons.tabSnacksFilled || icons.tabSnacks) : icons.tabSnacks;
  }
  if (
    name.includes('drink') ||
    name.includes('juice') ||
    name.includes('beverage') ||
    name.includes('beer') ||
    name.includes('soda') ||
    name.includes('cola') ||
    name.includes('water') ||
    name.includes('tea') ||
    name.includes('coffee')
  ) {
    return isActive ? (icons.tabBeveragesFilled || icons.tabBeverages) : icons.tabBeverages;
  }
  if (
    name.includes('care') ||
    name.includes('beauty') ||
    name.includes('skin') ||
    name.includes('lotion') ||
    name.includes('soap') ||
    name.includes('shampoo') ||
    name.includes('hair') ||
    name.includes('hygiene')
  ) {
    return isActive ? (icons.tabPersonalCareFilled || icons.tabPersonalCare) : icons.tabPersonalCare;
  }
  if (
    name.includes('bag') ||
    name.includes('school') ||
    name.includes('stationery') ||
    name.includes('office') ||
    name.includes('pen') ||
    name.includes('book')
  ) {
    return isActive ? (icons.tabSchoolBagFilled || icons.tabSchoolBag) : icons.tabSchoolBag;
  }

  return isActive ? (icons.tabBasketFilled || icons.tabBasket) : icons.tabBasket;
};

export default getCategoryTabIcon;
