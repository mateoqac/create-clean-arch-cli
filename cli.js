#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para crear directorios de forma recursiva
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Función para crear un archivo con contenido
const createFile = (filePath, content) => {
  fs.writeFileSync(filePath, content);
};

// Función para generar el package.json del workspace principal
const generateMainPackageJson = (projectName) => {
  return {
    "name": projectName,
    "version": "1.0.0",
    "private": true,
    "workspaces": [
      "packages/*"
    ],
    "scripts": {
      "build": "npm run build --workspaces",
      "test": "npm run test --workspaces"
    }
  };
};

// Función para generar package.json para cada subproyecto
const generatePackageJson = (projectName, packageName, dependencies = {}, devDependencies = {}) => {
  return {
    "name": `@${projectName}/${packageName}`,
    "version": "1.0.0",
    "main": "src/index.ts",
    "types": "src/index.ts",
    "scripts": {
      "build": "tsc",
      "test": "jest"
    },
    "dependencies": dependencies,
    "devDependencies": {
      "typescript": "^5.0.0",
      "@types/node": "^20.0.0",
      "jest": "^29.0.0",
      "@types/jest": "^29.0.0",
      ...devDependencies
    }
  };
};

// Función para generar tsconfig.json
const generateTsConfig = () => {
  return {
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "lib": ["ES2020"],
      "declaration": true,
      "sourceMap": true,
      "outDir": "./dist",
      "strict": true,
      "moduleResolution": "node",
      "baseUrl": "./",
      "esModuleInterop": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true
    },
    "exclude": ["node_modules", "dist"]
  };
};

// Función principal para crear la estructura del proyecto
async function createProject() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Ingrese el nombre del proyecto:',
      validate: input => input.trim().length > 0
    }
  ]);

  const projectName = answers.projectName.toLowerCase().replace(/\s+/g, '-');
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`\nCreando proyecto: ${projectName}...`);

  // Crear directorio principal
  createDirectory(projectPath);

  // Crear package.json principal
  createFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(generateMainPackageJson(projectName), null, 2)
  );

  // Crear tsconfig.json principal
  createFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(generateTsConfig(), null, 2)
  );

  // Crear estructura de carpetas y archivos para cada paquete
  const packages = ['domain', 'core', 'infrastructure', 'ioc', 'presentation'];
  const packagesPath = path.join(projectPath, 'packages');

  createDirectory(packagesPath);

  for (const pkg of packages) {
    const pkgPath = path.join(packagesPath, pkg);
    createDirectory(path.join(pkgPath, 'src'));
    createDirectory(path.join(pkgPath, 'tests'));

    // Crear package.json específico para cada paquete
    let dependencies = {};
    let devDependencies = {};

    switch(pkg) {
      case 'core':
        dependencies[`@${projectName}/domain`] = "^1.0.0";
        break;
      case 'infrastructure':
        dependencies = {
          [`@${projectName}/domain`]: "^1.0.0",
          [`@${projectName}/core`]: "^1.0.0"
        };
        break;
      case 'ioc':
        dependencies = {
          [`@${projectName}/domain`]: "^1.0.0",
          [`@${projectName}/core`]: "^1.0.0",
          [`@${projectName}/infrastructure`]: "^1.0.0",
          "inversify": "^6.0.0"
        };
        break;
      case 'presentation':
        dependencies = {
          [`@${projectName}/domain`]: "^1.0.0",
          [`@${projectName}/core`]: "^1.0.0",
          [`@${projectName}/infrastructure`]: "^1.0.0",
          [`@${projectName}/ioc`]: "^1.0.0",
          "express": "^4.18.2"
        };
        devDependencies = {
          "@types/express": "^4.17.17",
          "ts-node-dev": "^2.0.0"
        };
        break;
    }

    createFile(
      path.join(pkgPath, 'package.json'),
      JSON.stringify(generatePackageJson(projectName, pkg, dependencies, devDependencies), null, 2)
    );

    // Crear tsconfig.json para cada paquete
    createFile(
      path.join(pkgPath, 'tsconfig.json'),
      JSON.stringify(generateTsConfig(), null, 2)
    );

    // Crear index.ts vacío
    createFile(path.join(pkgPath, 'src', 'index.ts'), '');
  }

  // Crear estructura adicional de carpetas
  const folders = {
    domain: ['entities', 'value-objects', 'interfaces'],
    core: ['use-cases', 'interfaces'],
    infrastructure: ['repositories', 'services'],
    ioc: ['containers', 'modules'],
    presentation: ['controllers', 'middlewares', 'routes']
  };

  for (const [pkg, subfolders] of Object.entries(folders)) {
    for (const subfolder of subfolders) {
      createDirectory(path.join(packagesPath, pkg, 'src', subfolder));
    }
  }

  console.log('\nInstalando dependencias...');

  // Inicializar git
  process.chdir(projectPath);
  execSync('git init');

  // Crear .gitignore
  createFile(
    path.join(projectPath, '.gitignore'),
    'node_modules/\ndist/\n.env\n'
  );

  // Instalar dependencias
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n¡Proyecto creado exitosamente!');
  console.log(`\nPara comenzar:\n`);
  console.log(`  cd ${projectName}`);
  console.log('  npm run build');
}

program
  .name('create-clean-arch')
  .description('CLI para crear un proyecto Node.js con Clean Architecture')
  .version('1.0.0')
  .action(createProject);

program.parse();
