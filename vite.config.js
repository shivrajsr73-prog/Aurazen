import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'

// Auto-copy generated t-shirt image to public/ on dev start
function copyGeneratedAssets() {
  return {
    name: 'copy-generated-assets',
    buildStart() {
      try {
        mkdirSync('public', { recursive: true });
        copyFileSync(
          'C:/Users/mayan/.gemini/antigravity/brain/c9a5cb67-d37a-4527-840e-0111412eef45/aura_tshirt_realistic_1778580190974.png',
          'public/aura_tshirt.png'
        );
        console.log('[assets] ✓ aura_tshirt.png copied to public/');
      } catch (e) {
        console.warn('[assets] aura_tshirt.png not found, skipping.');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyGeneratedAssets()],
})
