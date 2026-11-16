module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Still Browser',
    executableName: 'still-browser'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'Still Browser'
      }
    },
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        authors: 'Still Browser contributors',
        description: 'A quiet, customizable desktop browser.'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          maintainer: 'Still Browser contributors',
          categories: ['Network', 'WebBrowser']
        }
      }
    },
    {
      name: '@electron-forge/maker-appimage',
      platforms: ['linux'],
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux']
    }
  ]
};
