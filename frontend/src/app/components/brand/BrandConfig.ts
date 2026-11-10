/**
 * Brand configuration for the Client Edition.
 * Easily customized or white-labeled per client requirements.
 */
export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  version: string;
  edition: string;
  copyright: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: "InternPath",
  shortName: "IP",
  tagline: "Intelligent Internship & Talent Placement Management System",
  version: "2.4.0",
  edition: "Client Edition",
  copyright: "© 2026 InternPath. All rights reserved."
};
