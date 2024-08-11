// import { defineConfig } from 'vite'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
 
// }
// })

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [react(),nodePolyfills(),wasm()],

  // plugins: [nodePolyfills()]
})
