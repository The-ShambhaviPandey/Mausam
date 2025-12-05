// weatherDescription.js

const weatherDescriptions = {
  clear: "The sky stands unburdened, washed in sunlight like truth finally spoken. Enjoy your day!",

  clouds: "Grey veils drift across the sky, soft but heavy, like thoughts you haven’t said aloud. Carry your umbrella of light.",

  drizzle: "A shy kind of rain, soft as a confession whispered at the edge of a dream. Feel the petrichor in the air.",

  rain: "Raindrops drum their honest rhythm, turning the world into a blurred watercolor. Feel the refreshing embrace of nature.",

  snow: "A quiet, white hush falls over everything, as if the world is holding its breath. Enjoy the aesthetics through your window.",

  thunderstorm: "Lightning cracks the sky open, a reminder that even the heavens lose their temper. Hold your loved ones close.",

  fog: "The world folds into itself, wrapped in a pale uncertainty that hides more than it reveals. Keep your car wipers on.",

  haze: "A dull softness settles on the air, obscuring distance and sharpening longing. The next morning holds new clarity.",

  sand: "Grain by grain, the wind carries the desert’s rage, scraping stories into the horizon. Protect your skin and eyes.",

  default:
    "The weather shifts, the world turns, and the sky writes its own quiet poem.",
};


export const getWeatherDescription = condition => {
  const key = condition?.toLowerCase();
  return weatherDescriptions[key] || weatherDescriptions['default'];
};

export default weatherDescriptions;
