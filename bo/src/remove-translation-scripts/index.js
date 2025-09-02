import { exec as execCallback, execSync } from 'child_process'
import { promisify } from 'util'

import { consola } from 'consola'

import { findAndReplaceInFiles } from './findAndReplaceInFiles'
import { modifyGenerateMenuFile } from './modifyGenerateMenuFile'
import { removeFilesAndFolders } from './removeFilesAndFolders'
import { removeLangaugeDropdown } from './removeLangaugeDropdown'
import { reverseEslintConfig, updateEslintConfig } from './removeUnusedImports'
import removeUnwantedCode from './removeUnwantedCode'
import { updateAuthGuard, updateGuestOnlyRoutes } from './updateHocs'
import {
  updateLayoutFile,
  updateDashboardLayoutFile,
  updateGuestLayoutFile,
  updateBlankLayoutFile,
  updateFrontLayoutFile
} from './updateLayoutFiles'
import { updateMenuFiles } from './updateMenuFiles'
import { updatePackages } from './updatePackages'

const exec = promisify(execCallback)

async function main() {
  await updatePackages()
  consola.start('Moving files from src/app/[lang] to src/app...')
  execSync('cp -r src/app/\\[lang\\]/* src/app')
  execSync('rm -rf src/app/\\[lang\\]')
  consola.success('Moved files from src/app/[lang] to src/app')
  await removeFilesAndFolders()
  await updateAuthGuard()
  await updateGuestOnlyRoutes()
  await findAndReplaceInFiles()
  await updateMenuFiles()
  await removeLangaugeDropdown()
  await updateLayoutFile()
  await updateDashboardLayoutFile()
  await updateGuestLayoutFile()
  await updateBlankLayoutFile()
  await updateFrontLayoutFile()
  await modifyGenerateMenuFile()
  await updateEslintConfig()

  // ────────────── Lint & Format Files ──────────────
  // Run pnpm lint command to fix all the linting error and give space after imports
  consola.start('Run pnpm lint command to fix all the linting error and give space after imports')
  await exec('pnpm run lint:fix')
  consola.success('Linted all the files successfully!\n')

  // Run pnpm format command to format all the files using prettier
  consola.start('Run pnpm format command to format all the files using prettier')
  await exec('pnpm run format')
  await exec('pnpm run lint:fix')
  consola.success('Formatted all the files successfully!\n')

  // ────────────── Remove Unwanted Code & Comments ──────────────
  await removeUnwantedCode()
  await reverseEslintConfig()
}

main()
