import Script from 'next/script';

const TAILWIND_CONFIG = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'bk-brown': '#502314',
        'bk-avana': '#F5EBDC',
        'bk-orange': '#FF8732',
        'bk-red': '#D62300',
        'bk-green': '#198737',
        'bk-dark': '#E8DFCF',
      },
      maxWidth: { '1600': '1600px' },
    },
  },
};
`;

export function TailwindSetup() {
  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script id="bk-tailwind-config" strategy="beforeInteractive">
        {TAILWIND_CONFIG}
      </Script>
    </>
  );
}