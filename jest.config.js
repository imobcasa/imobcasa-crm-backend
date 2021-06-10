module.exports = {
  // preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules"],
  testPathIgnorePatterns : [
    "./src/__tests__/helpers" 
  ]
};

// "jest": {
//   "testEnvironment": "node",
//   "coveragePathIgnorePatterns": [
//     "/node_modules/"
//   ],
//   "verbose": true
// }