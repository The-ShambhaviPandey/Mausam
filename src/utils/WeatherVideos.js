const weatherMedia = {
  clear: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/51110/51110-720.mp4',
    night: 'https://assets.mixkit.co/videos/10293/10293-720.mp4'
  },
  clouds: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/51102/51102-720.mp4',
    night: 'https://assets.mixkit.co/videos/47299/47299-720.mp4'
  },
  drizzle: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/18309/18309-720.mp4',
    night: 'https://assets.mixkit.co/videos/28097/28097-720.mp4'
  },
  rain: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/6890/6890-720.mp4',
    night: 'https://assets.mixkit.co/videos/27704/27704-720.mp4'
  },
  snow: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/35040/35040-720.mp4',
    night: 'https://assets.mixkit.co/videos/26956/26956-720.mp4'
  },
  thunderstorm: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/9681/9681-720.mp4',
    night: 'https://assets.mixkit.co/videos/47948/47948-720.mp4'
  },
  fog: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/47655/47655-720.mp4',
    night: 'https://assets.mixkit.co/videos/46194/46194-720.mp4'
  },
  haze: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/28342/28342-720.mp4',
    night: 'https://assets.mixkit.co/videos/4433/4433-720.mp4'
  },
  sand: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/4149/4149-720.mp4',
    night: 'https://assets.mixkit.co/videos/46389/46389-720.mp4'
  },
  default: {
    type: 'video',
    day: 'https://assets.mixkit.co/videos/1780/1780-720.mp4',
    night:'https://assets.mixkit.co/videos/1610/1610-720.mp4'
  }
};

export const getWeatherMedia = (condition, timeOfDay) => {
  const key = condition?.toLowerCase();
  const media = weatherMedia[key] || weatherMedia.default;

  // return appropriate video based on day/night
  return {
    type: media.type,
    src: media[timeOfDay] || media.day  // fallback to day if something weird happens
  };
};

export default weatherMedia;
