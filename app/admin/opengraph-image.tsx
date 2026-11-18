import { ogAdmin, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Panel del colegio · Howard Gardner Bilingual School";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogAdmin();
}
