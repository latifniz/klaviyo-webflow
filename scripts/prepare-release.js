#!/usr/bin/env node

/**
 * Release preparation script for the Klaviyo-Webflow integration
 * 
 * This script:
 * 1. Prompts for a new version number
 * 2. Prompts for changes in this version
 * 3. Updates the versions configuration file
 * 4. Reminds to create the script file
 * 
 * Usage: npm run release:prepare
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config', 'versions.ts');

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

/**
 * Main function to prepare a new release
 */
async function prepareRelease() {
  console.log(`\n${COLORS.bright}${COLORS.cyan}Klaviyo-Webflow Integration - Release Preparation${COLORS.reset}\n`);

  try {
    // Check if config file exists
    if (!fs.existsSync(CONFIG_FILE)) {
      console.error(`${COLORS.red}Error: Config file not found at ${CONFIG_FILE}${COLORS.reset}`);
      process.exit(1);
    }

    // Load current versions config
    let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Extract current version info using regex
    const versionsMatch = configContent.match(/export const VERSIONS: ScriptVersion\[\] = \[([\s\S]*?)\];/);
    if (!versionsMatch) {
      console.error(`${COLORS.red}Error: Could not parse versions from config file${COLORS.reset}`);
      process.exit(1);
    }
    
    // Find the latest version (first in the array)
    const latestVersionMatch = configContent.match(/number: ['"]([^'"]+)['"],\s+date: ['"][^'"]+['"],\s+status: ['"]latest['"]/);
    const currentVersion = latestVersionMatch ? latestVersionMatch[1] : '1.0.0';

    // Calculate suggested next version (increment patch number)
    const versionParts = currentVersion.split('.').map(Number);
    const suggestedVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;

    console.log(`${COLORS.yellow}Current version: ${COLORS.bright}${currentVersion}${COLORS.reset}`);
    console.log(`${COLORS.yellow}Suggested next version: ${COLORS.bright}${suggestedVersion}${COLORS.reset}\n`);

    // Prompt for new version
    const newVersion = await promptInput(`Enter the new version number (or press Enter to use ${suggestedVersion}): `) || suggestedVersion;
    
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
      console.error(`${COLORS.red}Error: Invalid version format. Version must be in the format x.y.z${COLORS.reset}`);
      process.exit(1);
    }
    
    // Prompt for changes
    console.log(`\n${COLORS.yellow}Enter changes for version ${COLORS.bright}${newVersion}${COLORS.yellow} (one per line, empty line to finish):${COLORS.reset}`);
    const changes = await promptMultilineInput();
    
    if (changes.length === 0) {
      console.error(`${COLORS.red}Error: At least one change is required${COLORS.reset}`);
      process.exit(1);
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Create new version object
    const newVersionEntry = `  {
    number: '${newVersion}',
    date: '${today}',
    status: 'latest',
    changes: [
${changes.map(change => `      '${change.replace(/'/g, "\\'")}'`).join(',\n')}
    ],
    file: 'klaviyo-webflow-${newVersion}.min.js'
  }`;
    
    // Update previous latest to stable
    configContent = configContent.replace(/status: ['"]latest['"]/g, "status: 'stable'");
    
    // Add new version to the beginning of the array
    configContent = configContent.replace(
      /export const VERSIONS: ScriptVersion\[\] = \[/,
      `export const VERSIONS: ScriptVersion[] = [\n${newVersionEntry},`
    );
    
    // Write updated config back to file
    fs.writeFileSync(CONFIG_FILE, configContent);
    
    console.log(`\n${COLORS.green}${COLORS.bright}✅ Version configuration updated to ${newVersion}!${COLORS.reset}\n`);
    
    // Create the script directories if they don't exist
    const scriptDir = path.join(__dirname, '..', 'public', 'scripts', 'versions');
    if (!fs.existsSync(scriptDir)) {
      fs.mkdirSync(scriptDir, { recursive: true });
      console.log(`${COLORS.blue}Created directory: ${scriptDir}${COLORS.reset}`);
    }
    
    // Next steps
    console.log(`${COLORS.bright}Next steps:${COLORS.reset}`);
    console.log(`${COLORS.yellow}1. Create or copy the script file to:${COLORS.reset}`);
    console.log(`   ${COLORS.cyan}public/scripts/versions/klaviyo-webflow-${newVersion}.min.js${COLORS.reset}`);
    console.log(`${COLORS.yellow}2. Update the latest reference file:${COLORS.reset}`);
    console.log(`   ${COLORS.cyan}cp public/scripts/versions/klaviyo-webflow-${newVersion}.min.js public/scripts/klaviyo-webflow.min.js${COLORS.reset}`);
    console.log(`${COLORS.yellow}3. Commit and push your changes:${COLORS.reset}`);
    console.log(`   ${COLORS.cyan}git add src/config/versions.ts public/scripts/versions/ public/scripts/klaviyo-webflow.min.js${COLORS.reset}`);
    console.log(`   ${COLORS.cyan}git commit -m "Release version ${newVersion}"${COLORS.reset}`);
    console.log(`   ${COLORS.cyan}git push origin main${COLORS.reset}`);
    console.log(`${COLORS.yellow}4. Deploy your changes${COLORS.reset}\n`);
    
    const copyCommand = await promptInput(`Would you like to execute the script file copy command? (y/n): `);
    if (copyCommand.toLowerCase() === 'y') {
      // Check if the source file exists
      const sourcePath = path.join(__dirname, '..', 'script-assets', 'webflow-to-klaviyo-script.js');
      const targetDir = path.join(__dirname, '..', 'public', 'scripts', 'versions');
      const targetLatestDir = path.join(__dirname, '..', 'public', 'scripts');
      
      if (fs.existsSync(sourcePath)) {
        // Create target directories if they don't exist
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        if (!fs.existsSync(targetLatestDir)) {
          fs.mkdirSync(targetLatestDir, { recursive: true });
        }
        
        // Copy to versioned file
        const versionedTarget = path.join(targetDir, `klaviyo-webflow-${newVersion}.min.js`);
        fs.copyFileSync(sourcePath, versionedTarget);
        console.log(`${COLORS.green}Copied script to ${versionedTarget}${COLORS.reset}`);
        
        // Copy to latest file
        const latestTarget = path.join(targetLatestDir, 'klaviyo-webflow.min.js');
        fs.copyFileSync(sourcePath, latestTarget);
        console.log(`${COLORS.green}Copied script to ${latestTarget}${COLORS.reset}`);
        
        console.log(`\n${COLORS.green}${COLORS.bright}✅ Script files copied successfully!${COLORS.reset}\n`);
      } else {
        console.log(`\n${COLORS.yellow}Source script file not found at ${sourcePath}. Please copy the file manually.${COLORS.reset}\n`);
      }
    }
  } catch (error) {
    console.error(`\n${COLORS.red}Error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Prompt for a single line of input
 */
function promptInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for multiple lines of input (empty line to finish)
 */
async function promptMultilineInput() {
  const lines = [];
  let line;
  
  do {
    line = await promptInput(`${lines.length + 1}> `);
    if (line) lines.push(line);
  } while (line);
  
  return lines;
}

// Execute the main function
prepareRelease(); 