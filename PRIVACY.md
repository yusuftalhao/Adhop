# AdHop Privacy Policy

_Last updated: October 1, 2026_

AdHop is a browser extension that skips sponsored segments and other unwanted sections of YouTube videos. It is an open-source fork of [SponsorBlock](https://github.com/ajayyy/SponsorBlock) and uses the SponsorBlock community database at `sponsor.ajay.app`.

AdHop does not collect, sell, or share your personal information, and it contains no ads, analytics, or tracking of its own. The only data that leaves your browser is what is needed to fetch and submit skip segments, and it goes to the SponsorBlock server described below.

## What is stored on your device

- **Your settings** (which categories to skip, colors, keybinds, and so on).
- **A random user ID** generated when you install the extension. It is not linked to your name, email, Google account, or YouTube account.
- **Segment data** you have created or voted on, kept locally so the extension works quickly.

This data stays in your browser's extension storage. You can remove it at any time by uninstalling the extension or using the reset option in its settings.

## What is sent to the SponsorBlock server (sponsor.ajay.app)

- **When you watch a YouTube video:** the extension asks the server for that video's skip segments. To protect your privacy, it sends only the first few characters of a hash of the video ID, not the video ID itself, so the server cannot tell exactly which video you are watching.
- **When a segment is skipped:** an anonymous "segment viewed" count is sent so contributors can see how often their segments help people. You can turn this off in the settings ("Enable skip count tracking").
- **Only if you choose to contribute:** when you submit a segment, vote on one, or set a public username, the video ID, segment times, your random user ID, and the username you chose are sent to the server and become part of the public SponsorBlock database.

Like any web server, `sponsor.ajay.app` can see your IP address when the extension connects to it. That server is run by the SponsorBlock project, not by AdHop, and its handling of data is covered by SponsorBlock's own policies.

## Permissions

- **storage / unlimitedStorage:** to save your settings and segment data on your device.
- **scripting and access to youtube.com:** to detect videos, show the segment bar and buttons in the player, and skip segments.
- **access to sponsor.ajay.app:** to fetch and submit segments.
- **optional access to other sites:** only requested if you enable support for other YouTube front-ends (such as Invidious) in the settings.

## Contact

Questions about this policy can be raised on the project's GitHub page: https://github.com/yusuftalhao/Adhop/issues
