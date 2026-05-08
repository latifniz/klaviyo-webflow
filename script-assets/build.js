/**
 * Klaviyo-Webflow Integration Build Script
 * 
 * This script generates the distribution files from the source files.
 * It creates both full and minified versions, and handles versioning.
 * 
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');
const terser = require('terser');

// Configuration
const config = {
  srcDir: './src',
  distDir: './dist',
  versions: ['v1', 'latest'],
  files: [
    { 
      input: 'index.js', 
      output: 'klaviyo-webflow.js',
      minOutput: 'klaviyo-webflow.min.js'
    }
  ],
  copyDirs: [
    { src: 'core', dest: 'core' },
    { src: 'utils', dest: 'utils' }
  ],
  configFile: './config/config.js',
  banner: '/**\n' +
          ' * Klaviyo-Webflow Integration\n' +
          ' * @version {{version}}\n' +
          ' * @link https://github.com/yourusername/klaviyo-webflow\n' +
          ' * @license MIT\n' +
          ' */\n'
};

// Utility functions
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readPackageVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return pkg.version || '1.0.0';
  } catch (e) {
    console.warn('Unable to read package.json, using default version 1.0.0');
    return '1.0.0';
  }
}

function copyFile(source, destination) {
  ensureDirectoryExists(path.dirname(destination));
  fs.copyFileSync(source, destination);
  console.log(`Copied ${source} to ${destination}`);
}

function copyDirectory(source, destination) {
  ensureDirectoryExists(destination);
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  }
}

async function minifyFile(source, destination, version) {
  try {
    const code = fs.readFileSync(source, 'utf8');
    const banner = config.banner.replace('{{version}}', version);
    
    const result = await terser.minify(code, {
      compress: true,
      mangle: true,
      output: {
        preamble: banner,
        beautify: false
      },
      sourceMap: {
        filename: path.basename(destination),
        url: path.basename(destination) + '.map'
      }
    });
    
    fs.writeFileSync(destination, result.code);
    
    if (result.map) {
      fs.writeFileSync(destination + '.map', result.map);
    }
    
    console.log(`Minified ${source} to ${destination}`);
  } catch (error) {
    console.error(`Error minifying ${source}:`, error);
  }
}

// Main build function
async function build() {
  const version = readPackageVersion();
  console.log(`Building version ${version}...`);
  
  // Clear the dist directory
  if (fs.existsSync(config.distDir)) {
    fs.rmSync(config.distDir, { recursive: true, force: true });
  }
  
  // Create the dist directory
  ensureDirectoryExists(config.distDir);
  
  // Copy config
  copyFile(config.configFile, path.join(config.distDir, 'config', 'config.js'));
  
  // Process each version
  for (const versionDir of config.versions) {
    const versionPath = path.join(config.distDir, versionDir);
    ensureDirectoryExists(versionPath);
    
    // Copy subdirectories
    for (const dir of config.copyDirs) {
      const sourcePath = path.join(config.srcDir, dir.src);
      const destPath = path.join(versionPath, dir.dest);
      copyDirectory(sourcePath, destPath);
    }
    
    // Process each file
    for (const file of config.files) {
      const sourcePath = path.join(config.srcDir, file.input);
      const destPath = path.join(versionPath, file.output);
      const minDestPath = path.join(versionPath, file.minOutput);
      
      // Copy the original file
      copyFile(sourcePath, destPath);
      
      // Create minified version
      await minifyFile(sourcePath, minDestPath, version);
    }
  }
  
  // Create the root minified file that redirects to the latest version
  const redirectCode = `
/**
 * Klaviyo-Webflow Integration (redirects to latest version)
 * @version ${version}
 * @license MIT
 */
(function() {
  // Load the latest version
  const script = document.createElement('script');
  script.src = document.currentScript.src.replace(/[^/]+$/, 'latest/klaviyo-webflow.min.js');
  script.async = document.currentScript.async;
  script.defer = document.currentScript.defer;
  script.onerror = function() {
    console.error('Failed to load Klaviyo-Webflow integration script');
  };
  document.head.appendChild(script);
})();`;
  
  fs.writeFileSync(path.join(config.distDir, 'klaviyo-webflow.min.js'), redirectCode);
  console.log('Created redirect script for root directory');
  
  console.log(`Build completed successfully for version ${version}`);
}

// Run the build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
}); 