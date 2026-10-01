import { extractVideoID, isOnInvidious } from "../../maze-utils/src/video";
import Config from "../config";
import { getHasStartSegment, getVideoLabel } from "./videoLabels";
import { getThumbnailSelector, setThumbnailListener } from "../../maze-utils/src/thumbnailManagement";
import { VideoID } from "../types";
import { getSegmentsForVideo } from "./segmentData";
import { onMobile } from "../../maze-utils/src/pageInfo";

export async function handleThumbnails(thumbnails: HTMLImageElement[]): Promise<void> {
    await Promise.all(thumbnails.map((t) => {
        labelThumbnail(t);
        setupThumbnailHover(t);
    }));
}

export async function labelThumbnail(thumbnail: HTMLImageElement): Promise<HTMLElement | null> {
    if (!Config.config?.fullVideoSegments || !Config.config?.fullVideoLabelsOnThumbnails) {
        hideThumbnailLabel(thumbnail);
        return null;
    }
    
    const videoID = await extractVideoIDFromElement(thumbnail);
    if (!videoID) {
        hideThumbnailLabel(thumbnail);
        return null;
    }

    const category = await getVideoLabel(videoID);
    if (!category) {
        hideThumbnailLabel(thumbnail);
        return null;
    }

    const { overlay, text } = createOrGetThumbnail(thumbnail);

    overlay.style.setProperty('--category-color', `var(--sb-category-preview-${category}, var(--sb-category-${category}))`);
    overlay.style.setProperty('--category-text-color', `var(--sb-category-text-preview-${category}, var(--sb-category-text-${category}))`);
    text.innerText = chrome.i18n.getMessage(`category_${category}`);
    overlay.classList.add("sponsorThumbnailLabelVisible");

    return overlay;
}

export async function setupThumbnailHover(thumbnail: HTMLImageElement): Promise<void> {
    // Cache would be reset every load due to no SPA
    if (isOnInvidious()) return;

    const mainElement = thumbnail.closest("#dismissible") as HTMLElement;
    if (mainElement) {
        mainElement.removeEventListener("mouseenter", thumbnailHoverListener);
        mainElement.addEventListener("mouseenter", thumbnailHoverListener);
    }
}

function thumbnailHoverListener(e: MouseEvent) {
    if (!chrome.runtime?.id) return;

    const thumbnail = (e.target as HTMLElement).querySelector(getThumbnailSelector()) as HTMLImageElement;
    if (!thumbnail) return;

    // Pre-fetch data for this video
    let fetched = false;
    const preFetch = async () => {
        fetched = true;
        const videoID = await extractVideoIDFromElement(thumbnail);
        if (videoID && await getHasStartSegment(videoID)) {
            void getSegmentsForVideo(videoID, false);
        }
    };
    const timeout = setTimeout(preFetch, 100);
    const onMouseDown = () => {
        clearTimeout(timeout);
        if (!fetched) {
            preFetch();
        }
    };

    e.target.addEventListener("mousedown", onMouseDown, { once: true });
    e.target.addEventListener("mouseleave", () => {
        clearTimeout(timeout);
        e.target.removeEventListener("mousedown", onMouseDown);
    }, { once: true });
}

function getLink(thumbnail: HTMLImageElement): HTMLAnchorElement | null {
    if (isOnInvidious()) {
        return thumbnail.parentElement as HTMLAnchorElement | null;
    } else if (!onMobile()) {
        const link = thumbnail.querySelector("a#thumbnail, a.reel-item-endpoint, a.yt-lockup-metadata-view-model__title, a.yt-lockup-metadata-view-model__title-link, a.yt-lockup-view-model__content-image, a.yt-lockup-metadata-view-model-wiz__title") as HTMLAnchorElement;
        if (link) {
            return link;
        } else if (thumbnail.nodeName === "YTD-HERO-PLAYLIST-THUMBNAIL-RENDERER"
            || thumbnail.nodeName === "YT-THUMBNAIL-VIEW-MODEL"
        ) {
            return thumbnail.closest("a") as HTMLAnchorElement;
        } else {
            return null;
        }
    } else {
        // Big thumbnails, compact thumbnails, shorts, channel feature, playlist header
        return thumbnail.querySelector("a.media-item-thumbnail-container, a.compact-media-item-image, a.reel-item-endpoint, :scope > a, .amsterdam-playlist-thumbnail-wrapper > a") as HTMLAnchorElement;
    }
}

async function extractVideoIDFromElement(thumbnail: HTMLImageElement): Promise<VideoID | null> {
    const link = getLink(thumbnail);
    if (!link || link.nodeName !== "A" || !link.href) return null; // no link found

    return await extractVideoID(link);
}

function getOldThumbnailLabel(thumbnail: HTMLImageElement): HTMLElement | null {
    return thumbnail.querySelector(".sponsorThumbnailLabel") as HTMLElement | null;
}   

function hideThumbnailLabel(thumbnail: HTMLImageElement): void {
    const oldLabel = getOldThumbnailLabel(thumbnail);
    if (oldLabel) {
        oldLabel.classList.remove("sponsorThumbnailLabelVisible");
    }
}

function createOrGetThumbnail(thumbnail: HTMLImageElement): { overlay: HTMLElement; text: HTMLElement } {
    const oldElement = getOldThumbnailLabel(thumbnail);
    if (oldElement) {
        return {
            overlay: oldElement as HTMLElement,
            text: oldElement.querySelector("span") as HTMLElement
        };
    }

    const overlay = document.createElement("div") as HTMLElement;
    overlay.classList.add("sponsorThumbnailLabel");
    // Disable hover autoplay
    overlay.addEventListener("pointerenter", (e) => {
        e.stopPropagation();
        thumbnail.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });
    overlay.addEventListener("pointerleave", (e) => {
        e.stopPropagation();
        thumbnail.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });

    const icon = createSBIconElement();
    const text = document.createElement("span");
    overlay.appendChild(icon);
    overlay.appendChild(text);
    thumbnail.appendChild(overlay);

    return {
        overlay,
        text
    };
}

function createSBIconElement(): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 512 512");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#SponsorBlockIcon");
    svg.appendChild(use);
    return svg;
}


// Inserts the icon svg definition, so it can be used elsewhere
function insertSBIconDefinition() {
    const container = document.createElement("span");

    // AdHop logo outline (same shape as the notice logo in svg-icons/sb_svg.tsx)
    container.innerHTML = `
<svg viewBox="0 0 512 512" style="display: none">
  <defs>
    <g id="SponsorBlockIcon">
      <path fill-rule="evenodd" d="M126,16 H386 A110,110 0 0 1 496,126 V386 A110,110 0 0 1 386,496 H126 A110,110 0 0 1 16,386 V126 A110,110 0 0 1 126,16 Z M130,48 H382 A82,82 0 0 1 464,130 V382 A82,82 0 0 1 382,464 H130 A82,82 0 0 1 48,382 V130 A82,82 0 0 1 130,48 Z"/>
      <g transform="translate(256 256) scale(0.76) translate(-256 -259)" stroke-linecap="round">
        <line x1="118" y1="372" x2="182" y2="372" stroke-width="52"/>
        <line x1="330" y1="372" x2="394" y2="372" stroke-width="52"/>
        <path d="M150 300 C 162 150, 330 120, 352 262" fill="none" stroke-width="46"/>
        <path d="M299 260 L 402 244 L 361 321 Z" stroke-width="18" stroke-linejoin="round"/>
      </g>
    </g>
  </defs>
</svg>`;
    document.body.appendChild(container.children[0]);
}

export function setupThumbnailListener(): void {
    setThumbnailListener(handleThumbnails, () => {
        insertSBIconDefinition();
    }, () => Config.isReady());
}