export const jwtConstants = {
  secret: 'KOx^&O%AD7k2T*o5zO3kLcoTn9Y9qq@X&7Tc4SE00dI4%!YhKH',
  secret_refresh: '7ZLBtStM4VC^@!8dyp8GXkhCxxAn82pJ7@i^h4Ig85myHlU6lx'
};

export const jwtTokenTypes = {
  ACCESS_TOKEN: 1,
  REFRESH_TOKEN: 2
};

export const jwtTokenSecretConstantsNames = {
  1: 'secret',
  2: 'secret_refresh'
};

export const jwtTokenExpirationTimes = {
  1: '30m',
  2: '30d'
};

export const todoStatuses = {
  UNCOMPLETED: 0,
  COMPLETED: 1
}
