"use client";

/**
 * TrustedBy Component
 * 
 * Displays a horizontal scrolling marquee of company logos.
 * Uses CSS animation for smooth infinite scroll effect.
 * 
 * Architecture Notes:
 * - Logos are duplicated to create seamless loop
 * - Animation pauses on hover for accessibility
 * - Fully responsive layout
 */

// SVG Logo Components  
const DiscordLogo = () => (
  <svg className="h-5" viewBox="0 0 124 34" fill="currentColor">
    <path d="M26.0015 6.9529C24.0021 6.03845 21.8787 5.37198 19.6623 5C19.3833 5.48048 19.0733 6.13144 18.8563 6.64292C16.4989 6.30193 14.1585 6.30193 11.8182 6.64292C11.6012 6.13144 11.2912 5.48048 11.0122 5C8.77933 5.37198 6.65595 6.03845 4.67319 6.9529C0.672263 12.8736 -0.411675 18.6548 0.130398 24.3585C2.79932 26.2959 5.36249 27.4739 7.87751 28.2489C8.51547 27.4149 9.08931 26.5263 9.59057 25.5907C8.66487 25.2607 7.77467 24.8552 6.93317 24.3822C7.15017 24.2257 7.36717 24.0612 7.57567 23.8967C12.7126 26.2073 18.2561 26.2073 23.3356 23.8967C23.5524 24.0612 23.7609 24.2257 23.9779 24.3822C23.1279 24.8552 22.2377 25.2607 21.3205 25.5907C21.8217 26.5263 22.3871 27.4149 23.0336 28.2489C25.5571 27.4739 28.1203 26.2959 30.7807 24.3585C31.4234 17.7559 29.7095 12.0212 26.0015 6.9529ZM10.3347 20.8043C8.78647 20.8043 7.51617 19.4197 7.51617 17.7478C7.51617 16.0758 8.75337 14.6912 10.3347 14.6912C11.9161 14.6912 13.1867 16.0758 13.1532 17.7478C13.1532 19.4197 11.9161 20.8043 10.3347 20.8043ZM20.5765 20.8043C19.0283 20.8043 17.758 19.4197 17.758 17.7478C17.758 16.0758 18.9952 14.6912 20.5765 14.6912C22.1579 14.6912 23.4285 16.0758 23.395 17.7478C23.395 19.4197 22.1579 20.8043 20.5765 20.8043Z"/>
    <path d="M44.2148 10.1626H49.8566C51.2839 10.1626 52.4967 10.4056 53.495 10.8916C54.4934 11.3776 55.2639 12.0661 55.8065 12.9571C56.3598 13.8481 56.6365 14.8996 56.6365 16.1116C56.6365 17.3236 56.3598 18.3751 55.8065 19.2661C55.2639 20.1571 54.4934 20.8456 53.495 21.3316C52.4967 21.8176 51.2839 22.0606 49.8566 22.0606H44.2148V10.1626ZM49.7143 19.3021C50.8663 19.3021 51.7676 18.9946 52.4182 18.3796C53.0795 17.7541 53.4101 16.8901 53.4101 15.7876C53.4101 14.6851 53.0795 13.8211 52.4182 13.1956C51.7676 12.5701 50.8663 12.2573 49.7143 12.2573H47.3661V19.3021H49.7143Z"/>
    <path d="M58.5962 10.1626H61.7475V22.0606H58.5962V10.1626Z"/>
    <path d="M69.6704 22.2766C68.6721 22.2766 67.7816 22.0876 66.999 21.7096C66.2165 21.3211 65.5952 20.7766 65.1353 20.0761C64.6753 19.3756 64.4453 18.5521 64.4453 17.6056C64.4453 16.6591 64.6753 15.8356 65.1353 15.1351C65.5952 14.4346 66.2165 13.8901 66.999 13.5016C67.7816 13.1131 68.6721 12.9189 69.6704 12.9189C70.5394 12.9189 71.3219 13.0809 72.0178 13.4049C72.7137 13.7289 73.2778 14.2041 73.7102 14.8304L71.6822 16.4011C71.1396 15.6574 70.4706 15.2856 69.6749 15.2856C69.0127 15.2856 68.4632 15.5016 68.0262 15.9337C67.5893 16.3659 67.3708 16.9266 67.3708 17.6161C67.3708 18.3056 67.5893 18.8664 68.0262 19.2986C68.4632 19.7307 69.0127 19.9467 69.6749 19.9467C70.4706 19.9467 71.1396 19.5749 71.6822 18.8312L73.7102 20.4019C73.2778 21.0282 72.7137 21.5034 72.0178 21.8274C71.3219 22.1514 70.5394 22.3134 69.6704 22.3134V22.2766Z"/>
    <path d="M80.8022 22.2766C79.7131 22.2766 78.7363 22.0821 77.8718 21.6931C77.0073 21.3041 76.3262 20.7536 75.8285 20.0416C75.3309 19.3296 75.082 18.4956 75.082 17.5396C75.082 16.5836 75.3309 15.7549 75.8285 15.0534C76.3262 14.3519 77.0073 13.8066 77.8718 13.4176C78.7363 13.0286 79.7131 12.8341 80.8022 12.8341C81.8912 12.8341 82.868 13.0286 83.7325 13.4176C84.597 13.8066 85.2781 14.3519 85.7758 15.0534C86.2734 15.7549 86.5223 16.5836 86.5223 17.5396C86.5223 18.4956 86.2734 19.3296 85.7758 20.0416C85.2781 20.7536 84.597 21.3041 83.7325 21.6931C82.868 22.0821 81.8912 22.2766 80.8022 22.2766ZM80.8022 19.8999C81.5015 19.8999 82.0765 19.6839 82.5272 19.2519C82.978 18.8199 83.2034 18.2539 83.2034 17.5539C83.2034 16.8539 82.978 16.2879 82.5272 15.8559C82.0765 15.4239 81.5015 15.2079 80.8022 15.2079C80.1028 15.2079 79.5278 15.4239 79.0771 15.8559C78.6263 16.2879 78.4009 16.8539 78.4009 17.5539C78.4009 18.2539 78.6263 18.8199 79.0771 19.2519C79.5278 19.6839 80.1028 19.8999 80.8022 19.8999Z"/>
    <path d="M88.5522 13.0554H91.6285V14.5829C91.9419 14.0754 92.3726 13.6704 92.9205 13.3679C93.4684 13.0554 94.1079 12.8991 94.8388 12.8991V16.0459C94.6573 16.0054 94.4543 15.9851 94.2298 15.9851C93.5305 15.9851 92.9682 16.2011 92.5429 16.6331C92.1176 17.0546 91.9049 17.6966 91.9049 18.5591V22.0606H88.7787V13.0554H88.5522Z"/>
    <path d="M102.164 22.2766C101.166 22.2766 100.275 22.0876 99.493 21.7096C98.7104 21.3211 98.0891 20.7766 97.6291 20.0761C97.1692 19.3756 96.9392 18.5521 96.9392 17.6056C96.9392 16.6591 97.1692 15.8356 97.6291 15.1351C98.0891 14.4346 98.7104 13.8901 99.493 13.5016C100.275 13.1131 101.166 12.9189 102.164 12.9189C103.162 12.9189 104.053 13.1131 104.835 13.5016C105.618 13.8901 106.239 14.4346 106.699 15.1351C107.159 15.8356 107.389 16.6591 107.389 17.6056V18.5521H100.135C100.242 19.0651 100.495 19.4691 100.893 19.7641C101.292 20.0591 101.787 20.2066 102.379 20.2066C102.831 20.2066 103.232 20.1256 103.582 19.9636C103.933 19.8016 104.236 19.5586 104.493 19.2346L106.853 20.6561C106.341 21.2176 105.709 21.6526 104.959 21.9611C104.208 22.2696 103.378 22.4239 102.469 22.4239L102.164 22.2766ZM100.092 16.4281H104.263C104.177 15.9581 103.951 15.5856 103.585 15.3106C103.22 15.0356 102.767 14.8981 102.228 14.8981C101.646 14.8981 101.161 15.0356 100.774 15.3106C100.387 15.5856 100.135 15.9581 100.019 16.4281H100.092Z"/>
    <path d="M115.233 22.2766C114.235 22.2766 113.344 22.0876 112.562 21.7096C111.779 21.3211 111.158 20.7766 110.698 20.0761C110.238 19.3756 110.008 18.5521 110.008 17.6056C110.008 16.6591 110.238 15.8356 110.698 15.1351C111.158 14.4346 111.779 13.8901 112.562 13.5016C113.344 13.1131 114.235 12.9189 115.233 12.9189C116.102 12.9189 116.884 13.0809 117.58 13.4049C118.276 13.7289 118.84 14.2041 119.273 14.8304L117.245 16.4011C116.702 15.6574 116.033 15.2856 115.238 15.2856C114.575 15.2856 114.026 15.5016 113.589 15.9337C113.152 16.3659 112.933 16.9266 112.933 17.6161C112.933 18.3056 113.152 18.8664 113.589 19.2986C114.026 19.7307 114.575 19.9467 115.238 19.9467C116.033 19.9467 116.702 19.5749 117.245 18.8312L119.273 20.4019C118.84 21.0282 118.276 21.5034 117.58 21.8274C116.884 22.1514 116.102 22.3134 115.233 22.3134V22.2766Z"/>
    <path d="M123.645 10.1626V22.0606H120.519V10.1626H123.645Z"/>
  </svg>
);

const McKinseyLogo = () => (
  <div className="flex flex-col items-center leading-none">
    <span className="text-[15px] font-medium tracking-tight text-adaline-dark">McKinsey</span>
    <span className="text-[11px] text-adaline-dark">&amp; Company</span>
  </div>
);

const SerifLogo = () => (
  <span className="text-[22px] font-serif font-bold italic text-adaline-dark tracking-tight">
    serif
  </span>
);

const SalesforceLogo = () => (
  <svg className="h-6" viewBox="0 0 150 105" fill="currentColor">
    <path d="M62.4 17.6c5.3-5.5 12.6-8.9 20.8-8.9 10.4 0 19.5 5.5 24.5 13.8 4.4-2 9.2-3.1 14.3-3.1 19.8 0 35.8 16 35.8 35.8s-16 35.8-35.8 35.8c-2.9 0-5.7-.3-8.4-1-4.4 8.4-13.2 14.1-23.4 14.1-4.4 0-8.5-1.1-12.2-3-4.8 9.6-14.7 16.2-26.2 16.2-12.4 0-23-7.7-27.2-18.6-1.9.3-3.9.4-5.9.4C8.1 99.1 0 91 0 81.5c0-6.2 3.3-11.6 8.2-14.6C6.8 63.5 6 59.6 6 55.5c0-15.3 12.4-27.7 27.7-27.7 5.7 0 11 1.7 15.5 4.7 3.5-6.3 9.6-11 16.8-13.1-.1-.6-.1-1.2-.1-1.8 0-9.4 7.6-17 17-17 7 0 13 4.2 15.6 10.2-5.7 1.5-10.9 4.3-15.1 8.2-6.2-3.2-12.8-4.6-21-1.4z" fill="#00A1E0"/>
  </svg>
);

const DoorDashLogo = () => (
  <div className="flex items-center gap-2">
    <svg className="h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.245.516h12.253a1.808 1.808 0 011.399 2.908 1.75 1.75 0 01-1.399.732H8.602a.595.595 0 00-.424.18l-3.3 3.381a.596.596 0 00.423 1.012h11.072a6.086 6.086 0 005.262-9.02c-.291-.506-.291-1.08 0-1.586a6.1 6.1 0 001.436-8.644z"/>
    </svg>
    <span className="text-[13px] font-bold tracking-[0.08em] text-adaline-dark">DOORDASH</span>
  </div>
);

const HubSpotLogo = () => (
  <span className="text-[18px] font-bold text-adaline-dark tracking-tight">
    HubSp<span className="relative">ö</span>t
  </span>
);

const CredibleLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1a3a2f">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <span className="text-[14px] font-medium text-adaline-dark">Credible</span>
  </div>
);

const ReorgLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
    <span className="text-[14px] font-medium text-adaline-dark">Reforge</span>
  </div>
);

const JerichoLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
    </svg>
    <span className="text-[13px] font-medium text-adaline-dark">Jericho Security</span>
  </div>
);

const StatfloLogo = () => (
  <div className="flex items-center gap-0.5">
    <span className="text-adaline-primary text-[14px]">$</span>
    <span className="text-[13px] font-bold tracking-[0.05em] text-adaline-dark">STATFLO</span>
  </div>
);

const DaybreakLogo = () => (
  <div className="flex items-center gap-1">
    <span className="text-[14px] font-medium text-adaline-dark">Daybreak</span>
    <svg className="h-4 w-4 text-adaline-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
  </div>
);

// Logo components in order
const logoComponents = [
  DiscordLogo,
  McKinseyLogo,
  SerifLogo,
  SalesforceLogo,
  DoorDashLogo,
  HubSpotLogo,
  CredibleLogo,
  ReorgLogo,
  JerichoLogo,
  StatfloLogo,
  DaybreakLogo,
];

function LogoItem({ Logo }: { Logo: React.ComponentType }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center px-8 sm:px-12 lg:px-14 h-10">
      <Logo />
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      className="relative w-full max-w-3xl mx-auto bg-transparent py-3 sm:py-4 overflow-hidden"
      data-component="trusted-by"
    >
      {/* Section Label */}
      <p className="text-center text-[10px] font-medium tracking-[0.2em] text-adaline-dark/50 uppercase mb-3 sm:mb-4">
        Trusted By
      </p>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient masks for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-adaline-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-adaline-cream to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Track */}
        <div className="flex animate-marquee w-max">
          {/* First set of logos */}
          {logoComponents.map((Logo, index) => (
            <LogoItem key={`first-${index}`} Logo={Logo} />
          ))}
          {/* Duplicate for seamless loop */}
          {logoComponents.map((Logo, index) => (
            <LogoItem key={`second-${index}`} Logo={Logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
