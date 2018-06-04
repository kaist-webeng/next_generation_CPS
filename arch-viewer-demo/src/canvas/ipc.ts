import { ipcRenderer } from 'electron'
import * as IPCType from '../IPCTypes'

export function sendDepReq(pkgName: string) {
  ipcRenderer.send(IPCType.GetDepOfPkg.Request, pkgName)
}
