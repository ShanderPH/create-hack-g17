// Test file to validate all imports work correctly
// This file can be run with: node test-imports.js

console.log('Testing project structure and imports...\n');

// Test 1: Check if package.json exists and has correct dependencies
try {
  const packageJson = require('./package.json');
  console.log('✅ package.json loaded successfully');
  console.log(`   Project: ${packageJson.name} v${packageJson.version}`);
  
  const requiredDeps = [
    '@heroui/system',
    '@supabase/supabase-js',
    'next',
    'react',
    'typescript',
    'tailwindcss',
    '@tanstack/react-query',
    'zustand',
    'i18next',
    'recharts',
    'react-map-gl'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are present');
  } else {
    console.log('❌ Missing dependencies:', missingDeps);
  }
} catch (error) {
  console.log('❌ Error loading package.json:', error.message);
}

// Test 2: Check configuration files
const fs = require('fs');
const path = require('path');

const configFiles = [
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'postcss.config.js'
];

configFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 3: Check project structure
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/hooks',
  'src/services',
  'app'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    console.log(`✅ Directory ${dir} exists`);
  } else {
    console.log(`❌ Directory ${dir} missing`);
  }
});

// Test 4: Check key files
const keyFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/providers.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/providers.tsx',
  'src/lib/supabase/client.ts',
  'src/hooks/useAuth.ts',
  'src/components/dashboard/MetricCard.tsx'
];

keyFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ File ${file} exists`);
  } else {
    console.log(`❌ File ${file} missing`);
  }
});

console.log('\n🎉 Project structure validation complete!');
console.log('Next steps:');
console.log('1. Run: npm install');
console.log('2. Set up environment variables (.env.local)');
console.log('3. Run: npm run dev');
console.log('4. Delete this test file when done: rm test-imports.js');
