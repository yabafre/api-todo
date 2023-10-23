module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000, // pour éviter le problème du timeout, ajustez selon vos besoins
    transform: {
        '^.+\\.js?$': 'babel-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
    moduleFileExtensions: ['js', 'json', 'node'],
};
