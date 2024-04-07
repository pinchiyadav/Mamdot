import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'pvr-movies',

  projectId: 'k3w4hkrm',
  dataset: 'production',

  //plugins: [structureTool(), visionTool()],
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
