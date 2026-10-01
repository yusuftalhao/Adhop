<p align="center"><img src="public/icons/LogoSponsorBlocker256px.png" width="128" alt="AdHop logo"></p>

# AdHop

AdHop is a browser extension that skips sponsors, intros, outros, subscription reminders and other annoying parts of YouTube videos.

Segments are crowdsourced: anyone can submit the start and end times of a sponsored section, and once one person does, everyone else skips right over it.

## About this fork

AdHop is a fork of [SponsorBlock](https://github.com/ajayyy/SponsorBlock) by Ajay Ramachandran, with a yellow theme, a new logo and a new name. It uses the SponsorBlock community database at [sponsor.ajay.app](https://sponsor.ajay.app), so skip segments are shared with SponsorBlock users. Thanks to Ajay and all SponsorBlock contributors.

- Privacy policy: [PRIVACY.md](PRIVACY.md)
- License: GPL-3.0, same as SponsorBlock (see [LICENSE](LICENSE)). The segment database is provided by SponsorBlock under its own license.

## Building

```bash
git clone --recursive https://github.com/yusuftalhao/Adhop.git
cd Adhop
cp config.json.example config.json
npm ci
npm run build:chrome
```

The built extension is in the `dist` folder. In Chrome, open `chrome://extensions`, turn on Developer mode, click **Load unpacked** and choose `dist`.
