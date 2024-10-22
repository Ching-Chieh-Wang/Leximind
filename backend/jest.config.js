module.exports = {
    // Other Jest configuration options...
  
    // This tells Jest how to map your module aliases
    moduleNameMapper: {
      '^@models/(.*)$': '<rootDir>/src/models/$1',
      '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
      '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
      '^@db/(.*)$': '<rootDir>/src/db/$1'
    },
  
    testEnvironment: 'node',
  };