export function AppBanner() {
  return (
    <section className="bk-app-banner-section">
      <div className="container-1600">
        <div className="div-app-banner">
          <div className="bk-app-banner-grid">
            <div className="bk-app-banner-col">
              <img
                src="https://www.burgerking.it/assets/img/console/appUser/banner/331_desktop_it.png?v=1710414705"
                alt="SCARICA LA NOSTRA APP"
                className="bk-app-banner-phone"
              />
            </div>
            <div className="bk-app-banner-text">
              <div className="font-flamebold bk-app-banner-title">SCARICA LA NOSTRA APP</div>
              <div className="font-flame bk-app-banner-sub">E goditi dei vantaggi da vero King!</div>
              <div className="bk-app-store-links">
                <a
                  href="https://play.google.com/store/apps/details?id=it.burgerking.android"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.burgerking.it/assets/images/store_google@2x.png"
                    alt="Google Play"
                  />
                </a>
                <a
                  href="https://itunes.apple.com/it/app/burger-king-italia/id680599060?mt=8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.burgerking.it/assets/images/store_appstore@2x.png"
                    alt="App Store"
                  />
                </a>
                <a
                  href="https://appgallery5.huawei.com/#/app/C102387701"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.burgerking.it/assets/images/store_appgallery@2x.png"
                    alt="AppGallery"
                  />
                </a>
              </div>
            </div>
            <div className="bk-app-banner-col bk-app-banner-col-hide-mobile">
              <img
                src="https://www.burgerking.it/assets/img/console/appUser/banner/703_desktop_it.jpg?v=1779286122"
                alt=""
                className="bk-app-banner-shot"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}