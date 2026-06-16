export type Preset = {
  id: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
  minWidth: number;
};

export type Platform = {
  id: string;
  name: string;
  color: string;
  presets: Preset[];
};

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    presets: [
      { id: "ig_feed_portrait", label: "Feed Portrait", width: 1080, height: 1350, ratio: "4:5", minWidth: 320 },
      { id: "ig_feed_square", label: "Feed Square", width: 1080, height: 1080, ratio: "1:1", minWidth: 320 },
      { id: "ig_feed_landscape", label: "Feed Landscape", width: 1080, height: 566, ratio: "1.91:1", minWidth: 600 },
      { id: "ig_story_reel", label: "Story / Reel", width: 1080, height: 1920, ratio: "9:16", minWidth: 720 },
      { id: "ig_profile", label: "Profile Picture", width: 320, height: 320, ratio: "1:1", minWidth: 110 },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    presets: [
      { id: "tt_cover", label: "Video Cover", width: 1080, height: 1920, ratio: "9:16", minWidth: 720 },
      { id: "tt_profile", label: "Profile Picture", width: 400, height: 400, ratio: "1:1", minWidth: 200 },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    presets: [
      { id: "yt_short", label: "Short", width: 1080, height: 1920, ratio: "9:16", minWidth: 720 },
      { id: "yt_thumbnail", label: "Video Thumbnail", width: 1280, height: 720, ratio: "16:9", minWidth: 640 },
      { id: "yt_banner", label: "Channel Banner", width: 2560, height: 1440, ratio: "16:9", minWidth: 2048 },
      { id: "yt_profile", label: "Profile Picture", width: 800, height: 800, ratio: "1:1", minWidth: 98 },
    ],
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "#000000",
    presets: [
      { id: "x_post", label: "In-Stream Image", width: 1200, height: 675, ratio: "16:9", minWidth: 600 },
      { id: "x_header", label: "Header", width: 1500, height: 500, ratio: "3:1", minWidth: 1500 },
      { id: "x_profile", label: "Profile Picture", width: 400, height: 400, ratio: "1:1", minWidth: 200 },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    presets: [
      { id: "li_feed_square", label: "Feed Square", width: 1200, height: 1200, ratio: "1:1", minWidth: 600 },
      { id: "li_feed_landscape", label: "Feed Landscape", width: 1200, height: 627, ratio: "1.91:1", minWidth: 600 },
      { id: "li_banner", label: "Personal Banner", width: 1584, height: 396, ratio: "4:1", minWidth: 1584 },
      { id: "li_profile", label: "Profile Picture", width: 400, height: 400, ratio: "1:1", minWidth: 200 },
      { id: "li_company", label: "Company Logo", width: 300, height: 300, ratio: "1:1", minWidth: 268 },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    presets: [
      { id: "fb_feed_square", label: "Feed Square", width: 1080, height: 1080, ratio: "1:1", minWidth: 600 },
      { id: "fb_feed_landscape", label: "Feed Landscape", width: 1200, height: 628, ratio: "1.91:1", minWidth: 600 },
      { id: "fb_story", label: "Story", width: 1080, height: 1920, ratio: "9:16", minWidth: 720 },
      { id: "fb_cover", label: "Cover Photo", width: 851, height: 315, ratio: "2.7:1", minWidth: 400 },
      { id: "fb_profile", label: "Profile Picture", width: 360, height: 360, ratio: "1:1", minWidth: 170 },
    ],
  },
];

export const ALL_PRESETS: Preset[] = PLATFORMS.flatMap((p) => p.presets);

export function getCoverScale(
  imgW: number,
  imgH: number,
  presetW: number,
  presetH: number,
): number {
  return Math.max(presetW / imgW, presetH / imgH);
}

export function meetsRequirement(
  imgW: number,
  imgH: number,
  preset: Preset,
): boolean {
  return imgW >= preset.width && imgH >= preset.height;
}
