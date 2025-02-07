const fs = require('fs');
const path = require('path');

// Create tailwind.config.js
const tailwindConfig = `
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig.trim());

// Create postcss.config.js
const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

fs.writeFileSync(path.join(__dirname, 'postcss.config.js'), postcssConfig.trim());

// Create index.css in the correct src directory
const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// Ensure the src directory exists before creating index.css
const cssFilePath = path.join(__dirname, 'index.css');
fs.writeFileSync(cssFilePath, cssContent.trim());

console.log('Tailwind CSS setup files created successfully!');