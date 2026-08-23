export const topCategories = [
    { id: '1', title: 'New Arrival', image: require('../../assets/images/category/casual.png') },
    { id: '2', title: 'Best Sellers', image: require('../../assets/images/home/items/shoes.png') },
    { id: '3', title: 'Big Discount', image: require('../../assets/images/category/casual.png') },
    { id: '4', title: 'Budget Buy', image: require('../../assets/images/category/casual.png') },
    { id: '5', title: 'Top Offers', image: require('../../assets/images/category/casual.png') },
];

const kshopeCategoriesBase = [
    { id: '1', title: 'Skin', image: require('../../assets/images/category/healthy.png') },
    { id: '2', title: 'Perfume', image: require('../../assets/images/category/perfume.jpg') },
    { id: '3', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png') },
    { id: '4', title: 'Healthy', image: require('../../assets/images/category/healthy.png') },
];
export const kshopeCategories = [
    ...kshopeCategoriesBase,
    ...kshopeCategoriesBase.map(i => ({ ...i, id: i.id + '_1' })),
    ...kshopeCategoriesBase.map(i => ({ ...i, id: i.id + '_2' }))
];

export const shopByCategory = [
    { id: '1', title: 'FASHION', image: require('../../assets/images/category/casual.png') },
    { id: '2', title: 'ACCESSORIES', image: require('../../assets/images/category/accesories.jpg') },
    { id: '3', title: 'BATHROOM ESSENTIAL', image: require('../../assets/images/category/bathroom_essential.jpg') },
    { id: '4', title: 'Kitchen', image: require('../../assets/images/category/bathroom_essential.jpg') },
];

export const shopByFashion = [
    { id: '1', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png') },
    { id: '2', title: 'Casual', image: require('../../assets/images/category/casual.png') },
    { id: '3', title: 'Skin', image: require('../../assets/images/category/healthy.png') },
];

export const shopByConcern = [
    { id: '1', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png') },
    { id: '2', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png') },
    { id: '3', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png') },
];

export const topBrands = Array(12).fill({ id: '1', title: 'Nike', image: require('../../assets/images/category/nike.png') }).map((i, index) => ({ ...i, id: index.toString() }));
