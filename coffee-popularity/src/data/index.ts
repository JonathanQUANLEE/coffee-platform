import { cities } from './cities';
import { coffeeTypes } from './coffee-types';
import { coffeeShops } from './coffee-shops';
import { popularityData } from './popularity';

export { cities, coffeeTypes, coffeeShops, popularityData };

export const getCities = () => cities;
export const getCityById = (id: string) => cities.find(city => city.id === id);

export const getCoffeeTypes = () => coffeeTypes;
export const getCoffeeTypeById = (id: string) => coffeeTypes.find(type => type.id === id);

export const getCoffeeShops = () => coffeeShops;
export const getCoffeeShopById = (id: string) => coffeeShops.find(shop => shop.id === id);
export const getCoffeeShopsByCity = (cityId: string) => coffeeShops.filter(shop => shop.cityId === cityId);

export const getPopularityData = () => popularityData;
export const getPopularityByCoffeeShop = (coffeeShopId: string) => 
  popularityData.filter(data => data.coffeeShopId === coffeeShopId);
export const getPopularityByCity = (cityId: string) => 
  popularityData.filter(data => data.cityId === cityId);

export const getCityWithStats = (cityId: string) => {
  const city = getCityById(cityId);
  if (!city) return null;

  const cityCoffeeShops = getCoffeeShopsByCity(cityId);
  const cityPopularity = getPopularityByCity(cityId);

  const totalCoffeeShops = cityCoffeeShops.length;
  const averageRating = cityCoffeeShops.reduce((sum, shop) => sum + shop.rating, 0) / totalCoffeeShops;
  const totalReviews = cityCoffeeShops.reduce((sum, shop) => sum + shop.reviewCount, 0);

  const topCoffeeShops = cityCoffeeShops
    .map(shop => {
      const popData = cityPopularity.find(p => p.coffeeShopId === shop.id);
      return {
        ...shop,
        popularityScore: popData?.popularityScore || 0,
        trend: 'stable' as const,
        city,
        topCoffeeTypes: [],
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore);

  return {
    ...city,
    totalCoffeeShops,
    averageRating,
    totalReviews,
    topCoffeeShops,
  };
};

export const getAllCitiesWithStats = () => {
  return cities.map(city => {
    const stats = getCityWithStats(city.id);
    return stats || {
      ...city,
      totalCoffeeShops: 0,
      averageRating: 0,
      totalReviews: 0,
      topCoffeeShops: [],
    };
  });
};