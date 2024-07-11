module.exports = {
  root: true,
  extends: ['./eslint-config'],
  overrides: [
    // Temporary overrides
    {
      files: ['dev/**/*.ts'],
      excludedFiles: ['dev/plugin.spec.ts'],
      rules: {
        'import/no-relative-packages': 'off',
        'no-process-env': 'off',
      },
    },
  ],
}
