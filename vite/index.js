import fs from 'fs';
import path from 'path';

export default function baseConfig(workingDir = '/app') {
  return {
    esbuild: {
      supported: {
        'top-level-await': true
      },
    },
    optimizeDeps: {
      exclude: ['@cronqvist/vue-common'],                        // Ignore pre-bundling of these packages
      include: ['dayjs', 'vue-api-query', 'axios-auth-refresh'], // CommonJS dependencies from vue-common
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(workingDir,'./src') },
        // Enable easier live editing for dependencies, by optional mounting of local packages in docker-compose
        viteResolveMountAliasForPackage('@cronqvist/vue-common', workingDir+'/packages/'),
      ].filter(x => x), // removes null values
    }
  }
};

export function viteResolveMountAliasForPackage(dependency, packagePath = '/app/packages/') {
  const name = dependency.split('/')[1] ?? dependency;
  packagePath = packagePath.replace(/\/$/, '')+'/'; // Ensure trailing slash
  if(fs.existsSync(`${packagePath}${name}/package.json`)) {
    return { find: dependency, replacement: packagePath+name }
  }
  return null;
}
