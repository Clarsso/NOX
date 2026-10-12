export interface ProductMetrics {
  views: number;
  cartAdds: number;
  orders: number;
}

const ANALYTICS_STORAGE_KEY = 'firma_studio_analytics';

export const getAnalyticsData = (): Record<string, ProductMetrics> => {
  try {
    const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const trackEvent = (productId: string, event: 'view' | 'cart' | 'order') => {
  const currentData = getAnalyticsData();
  const metrics = currentData[productId] || { views: 0, cartAdds: 0, orders: 0 };

  if (event === 'view') metrics.views += 1;
  if (event === 'cart') metrics.cartAdds += 1;
  if (event === 'order') metrics.orders += 1;

  currentData[productId] = metrics;
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(currentData));
};