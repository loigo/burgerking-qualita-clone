const A = 'https://www.burgerking.it';

export function AppBanner() {
  return (
    <section className="pb-12">
      <div
        className="max-w-screen-xl mx-auto div-app-banner mx-4 md:mx-auto rounded-xl overflow-hidden"
        style={{ backgroundColor: '#D62300' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-4 flex justify-center p-6">
            <img
              src={`${A}/assets/img/console/appUser/banner/331_desktop_it.png?v=1710414705`}
              alt="SCARICA LA NOSTRA APP"
              className="w-[70%] max-w-xs"
            />
          </div>
          <div className="md:col-span-5 text-center text-bk-avana p-6">
            <div className="font-flamebold text-[3.5rem] leading-[3.4rem] pb-4">
              SCARICA LA NOSTRA APP
            </div>
            <div className="font-flame text-[2.4rem] leading-[2.6rem] pb-4">
              E goditi dei vantaggi da vero King!
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:hidden">
              <a
                href="https://play.google.com/store/apps/details?id=it.burgerking.android"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${A}/assets/images/store_google@2x.png`}
                  alt="Google Play"
                  className="h-10"
                />
              </a>
              <a
                href="https://itunes.apple.com/it/app/burger-king-italia/id680599060?mt=8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${A}/assets/images/store_appstore@2x.png`}
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a
                href="https://appgallery5.huawei.com/#/app/C102387701"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${A}/assets/images/store_appgallery@2x.png`}
                  alt="AppGallery"
                  className="h-10"
                />
              </a>
            </div>
          </div>
          <div className="md:col-span-3 hidden md:flex justify-center p-6">
            <img
              src={`${A}/assets/img/console/appUser/banner/703_desktop_it.jpg?v=1779286122`}
              alt=""
              className="max-w-[300px] rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}