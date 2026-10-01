import icons from '../src/assets/icons';
import { getCategoryTabIcon } from '../src/screens/home/components/modern/categoryTabIcons';

describe('categoryTabIcons', () => {
  it('returns outline icons when isActive is false', () => {
    expect(getCategoryTabIcon('All', false)).toBe(icons.tabBasket);
    expect(getCategoryTabIcon('Fruits & vegetables', false)).toBe(icons.tabFruits);
    expect(getCategoryTabIcon('Staples & more', false)).toBe(icons.tabStaples);
    expect(getCategoryTabIcon('Home essentials', false)).toBe(icons.tabCleaning);
    expect(getCategoryTabIcon('Snacks & Munchies', false)).toBe(icons.tabSnacks);
    expect(getCategoryTabIcon('Cold Drinks & Juices', false)).toBe(icons.tabBeverages);
    expect(getCategoryTabIcon('Personal Care', false)).toBe(icons.tabPersonalCare);
    expect(getCategoryTabIcon('Stationery & Bags', false)).toBe(icons.tabSchoolBag);
  });

  it('returns filled icons when isActive is true', () => {
    expect(getCategoryTabIcon('All', true)).toBe(icons.tabBasketFilled);
    expect(getCategoryTabIcon('Fruits & vegetables', true)).toBe(icons.tabFruitsFilled);
    expect(getCategoryTabIcon('Staples & more', true)).toBe(icons.tabStaplesFilled);
    expect(getCategoryTabIcon('Home essentials', true)).toBe(icons.tabCleaningFilled);
    expect(getCategoryTabIcon('Snacks & Munchies', true)).toBe(icons.tabSnacksFilled);
    expect(getCategoryTabIcon('Cold Drinks & Juices', true)).toBe(icons.tabBeveragesFilled);
    expect(getCategoryTabIcon('Personal Care', true)).toBe(icons.tabPersonalCareFilled);
    expect(getCategoryTabIcon('Stationery & Bags', true)).toBe(icons.tabSchoolBagFilled);
  });

  it('defaults isActive to false', () => {
    expect(getCategoryTabIcon('All')).toBe(icons.tabBasket);
    expect(getCategoryTabIcon('Fruits & vegetables')).toBe(icons.tabFruits);
  });
});
