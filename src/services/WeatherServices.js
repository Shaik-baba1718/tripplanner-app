export const weatherService = {
  getCurrentWeather: async (city) => {
    try {
      const response = await fetch(`https://wttr.in/${city}?format=j1`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};