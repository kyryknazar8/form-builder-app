'use client';

import dynamic from 'next/dynamic';

// 🔹 Dynamically import Header without SSR
const Header = dynamic(() => import('./Header'), { ssr: false });

export default function HeaderWrapper() {
  return <Header />;
}
