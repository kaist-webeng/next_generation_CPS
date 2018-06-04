import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export const ReactDevAppID = 'fmkadmapgofadopljbjfkapdkoienihi'
export const ReduxDevAppID = 'lmhkpmbekcpmknklioeibfkpmmfibljd'

export function getDevToolPath(appID: string): string {
  let appPath: string = ''
  for (let i = 0; i < 10; i++) {
    appPath = getAppPath(appID, i)
    if (appPath) {
      break
    }
  }

  if (appPath) {
    const appVersion = fs
      .readdirSync(appPath)
      .filter(file => fs.statSync(path.join(appPath, file)).isDirectory())
      .sort((prev, next) => {
        if (next > prev) {
          return 1
        } else {
          return -1
        }
      })[0]

    return path.join(appPath, appVersion)
  } else {
    return null
  }
}

function getAppPath(appID: string, profileIndex: number): string {
  let appPath: string = ''
  const profile: string =
    profileIndex === 0 ? 'Default' : `Profile ${profileIndex}`

  if (os.platform() === 'darwin') {
    appPath = path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Google',
      'Chrome',
      profile,
      'Extensions',
      appID
    )
  } else if (os.platform() === 'win32') {
    appPath = path.join(
      os.homedir(),
      'AppData',
      'Local',
      'Google',
      'Chrome',
      'User Data',
      profile,
      'Extensions',
      appID
    )
  } else {
    appPath = path.join(
      os.homedir(),
      '.config',
      'google-chrome',
      profile,
      'Extensions',
      appID
    )
  }

  if (fs.existsSync(appPath)) {
    return appPath
  }

  return ''
}
