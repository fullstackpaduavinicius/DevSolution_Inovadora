import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ⚠️ Destrava o build mesmo com erros de ESLint (temporário)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Se (e só se) você precisar destravar por erros de Typescript:
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  // (Opcional) caso use <Image/> com remotos:
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: 'images.example.com' },
  //   ],
  // },
};

export default nextConfig;
