#!/usr/bin/env node
/**
 * Generate ENGLISH-SUMMARY.pdf from schools-index.json
 * Usage: node generate-pdf.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = __dir;
const FONT =
  process.env.PDF_CJK_FONT ||
  "/tmp/fonts/NotoSansCJKsc-Regular.otf";
const OUT = join(ROOT, "ENGLISH-SUMMARY.pdf");

const TYPE_MAP = {
  外籍: "Foreign passport school",
  港澳子弟: "HK/Macau/Taiwan school",
  公立国际部: "Public intl. program",
  民办: "Private bilingual/intl.",
  公立: "Public program",
};

const DISTRICT_MAP = {
  荔湾区: "Liwan",
  越秀区: "Yuexiu",
  海珠区: "Haizhu",
  天河区: "Tianhe",
  白云区: "Baiyun",
  黄埔区: "Huangpu",
  番禺区: "Panyu",
  花都区: "Huadu",
  南沙区: "Nansha",
  增城区: "Zengcheng",
  从化区: "Conghua",
};

const DISTRICT_ORDER = Object.keys(DISTRICT_MAP);

function translateFees(f) {
  return f
    .replace(/约/g, "~")
    .replace(/万\/年/g, "万 RMB/yr")
    .replace(/万\/学期/g, "万 RMB/sem")
    .replace(/公办国际部价位/g, "Public intl. pricing (verify)")
    .replace(/民办双语价位/g, "Private bilingual pricing")
    .replace(/民办价位/g, "Private school pricing")
    .replace(/外籍学校价位/g, "Foreign school pricing")
    .replace(/艺术国际高中价位/g, "Art intl. high school pricing")
    .replace(/预科价位/g, "Pre-college pricing")
    .replace(/民办 DSE 价位/g, "Private DSE pricing")
    .replace(/待定/g, "TBD");
}

function translateGrades(g) {
  return g
    .replace(/幼儿园/g, "K")
    .replace(/小学/g, "Primary")
    .replace(/初中/g, "Jr high")
    .replace(/高中/g, "Sr high")
    .replace(/、/g, ", ");
}

const schools = JSON.parse(
  readFileSync(join(ROOT, "schools-index.json"), "utf8")
);

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: "Guangzhou International Schools — English Summary",
    Author: "SophiaW / Ellen English Studio",
  },
});

const chunks = [];
doc.on("data", (c) => chunks.push(c));
doc.on("end", () => {
  writeFileSync(OUT, Buffer.concat(chunks));
  console.log(`Written ${OUT} (${Buffer.concat(chunks).length} bytes)`);
});

doc.registerFont("body", FONT);
doc.registerFont("bold", FONT);

const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function heading(text, size = 14) {
  doc.moveDown(0.5);
  doc.font("bold").fontSize(size).text(text, { width: pageW });
  doc.moveDown(0.3);
}

function body(text, size = 9) {
  doc.font("body").fontSize(size).text(text, { width: pageW, lineGap: 2 });
}

function ensureSpace(needed = 80) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - needed) {
    doc.addPage();
  }
}

// Title
doc.font("bold").fontSize(20).text("Guangzhou International Schools", {
  width: pageW,
});
doc.font("body").fontSize(12).text("English Summary — Ellen English Studio", {
  width: pageW,
});
doc.moveDown(0.3);
body(
  `Total: ${schools.length} schools · All 11 districts · Updated 2026-06-11 · SophiaW`,
  10
);
doc.moveDown(0.5);

heading("School types", 12);
for (const [cn, en] of Object.entries(TYPE_MAP)) {
  body(`${cn} = ${en}`, 9);
}
doc.moveDown(0.3);
body(
  "Tuition figures are from public sources (RMB). Verify on official websites. Foshan/Dongguan schools excluded.",
  8
);

const byDistrict = {};
for (const s of schools) {
  (byDistrict[s.district] ??= []).push(s);
}

for (const d of DISTRICT_ORDER) {
  const items = byDistrict[d];
  if (!items?.length) continue;

  doc.addPage();
  heading(`${DISTRICT_MAP[d]} District (${d}) — ${items.length} schools`, 14);

  for (let i = 0; i < items.length; i++) {
    const s = items[i];
    ensureSpace(120);
    doc
      .font("bold")
      .fontSize(10)
      .text(`${i + 1}. ${s.en}`, { width: pageW, continued: false });
    doc.font("body").fontSize(9).text(s.cn, { width: pageW });
    const lines = [
      `Type: ${TYPE_MAP[s.type] || s.type}`,
      `Grades: ${translateGrades(s.grades)}`,
      `Curriculum: ${s.curriculum}`,
      `Address: ${s.address}`,
      `Tuition: ${translateFees(s.fees)}`,
      s.website ? `Web: ${s.website}` : "Web: —",
      `Folder: ${s.slug}/`,
    ];
    for (const line of lines) {
      body(line, 8);
    }
    doc.moveDown(0.4);
  }
}

// Quick reference table
doc.addPage();
heading("Quick reference (all schools)", 14);
body("English | Chinese | District | Type | Curriculum", 7);
doc.moveDown(0.2);
for (const s of schools) {
  ensureSpace(30);
  const row = `${s.en} | ${s.cn} | ${DISTRICT_MAP[s.district] || s.district} | ${s.type} | ${s.curriculum}`;
  body(row, 7);
}

doc.addPage();
heading("Ellen priority outreach", 12);
body(
  "High fit for IELTS / academic English / university prep parents:\n" +
    "• Tianhe: Huijing Xincheng, SCNU HFI, JNU HK/Macau, Tianxing Intl.\n" +
    "• Yuexiu: Zhixin Ersha International\n" +
    "• Foreign schools: AISG, BSG, BASIS, ISA campuses, GUIS\n" +
    "• HK/Macau/DSE: Minsheng Nansha, JNU HK/Macau, Zhonghuang HK/Macau\n" +
    "• Pre-college: Alcanta International College (AIC)",
  9
);
doc.moveDown(0.5);
body(
  "Sources: Guangzhou Education Bureau (Mar 2025), international-schools-database.com",
  8
);

doc.end();
