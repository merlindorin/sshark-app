/**
 * Renders the raster favicons from public/icon.svg.
 *
 * The SVG is the source of truth and themes itself with a media query, but a favicon is fetched
 * outside any page, so the formats that cannot carry a query need one file per theme instead.
 * Rasterisers ignore the query and would render whichever palette is written first, hence the
 * substitution below rather than four hand-drawn files that drift from the logo.
 *
 * Run after changing the logo:  node scripts/generate-icons.mjs
 */

import { readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = join(root, "public", "icon.svg")

/** Tab-bar sizes. Small enough that the shark is a silhouette, so contrast matters more than detail. */
const FAVICON_SIZE = 32

/** What iOS asks for when adding to a home screen. */
const APPLE_SIZE = 180

const INK = "#242424"
const CREAM = "#f3d9b5"

/** A pale disc vanishes into a light tab bar and a dark one into a dark bar, so the palette flips. */
const PALETTES = {
	light: { disc: INK, shark: "#ffffff" },
	dark: { disc: CREAM, shark: INK },
}

const STYLE_BLOCK = /<style>[\s\S]*?<\/style>/

/** Replaces the themed stylesheet with one fixed palette, since the raster cannot switch later. */
function withPalette(svg, palette) {
	return svg.replace(STYLE_BLOCK, `<style>.disc{fill:${palette.disc}}.shark{fill:${palette.shark}}</style>`)
}

function render(svg, size, background) {
	const pipeline = sharp(Buffer.from(svg), { density: 384 }).resize(size, size, {
		fit: "contain",
		background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
	})

	return (background ? pipeline.flatten({ background }) : pipeline).png().toBuffer()
}

const ICO_HEADER_BYTES = 6
const ICO_ENTRY_BYTES = 16

/**
 * Wraps a PNG in an ICO container.
 *
 * sharp cannot write ICO, and /favicon.ico is still requested by anything that ignores the
 * declared icons. An ICO may hold a PNG verbatim, so this is a header rather than a re-encode.
 */
function toIco(png, size) {
	const header = Buffer.alloc(ICO_HEADER_BYTES)
	header.writeUInt16LE(0, 0) // reserved
	header.writeUInt16LE(1, 2) // 1 = icon
	header.writeUInt16LE(1, 4) // one image

	const entry = Buffer.alloc(ICO_ENTRY_BYTES)
	entry.writeUInt8(size, 0) // width
	entry.writeUInt8(size, 1) // height
	entry.writeUInt8(0, 2) // palette size, 0 for truecolour
	entry.writeUInt8(0, 3) // reserved
	entry.writeUInt16LE(1, 4) // colour planes
	entry.writeUInt16LE(32, 6) // bits per pixel
	entry.writeUInt32LE(png.length, 8)
	entry.writeUInt32LE(ICO_HEADER_BYTES + ICO_ENTRY_BYTES, 12)

	return Buffer.concat([header, entry, png])
}

async function main() {
	const svg = await readFile(source, "utf8")

	if (!STYLE_BLOCK.test(svg)) {
		throw new Error(`${source} has no <style> block to substitute; the palettes below would be ignored`)
	}

	const light = withPalette(svg, PALETTES.light)
	const dark = withPalette(svg, PALETTES.dark)

	const lightIcon = await render(light, FAVICON_SIZE)
	const darkIcon = await render(dark, FAVICON_SIZE)

	// Home-screen tiles are composited onto the wallpaper, so this one gets an opaque backdrop.
	const appleIcon = await render(dark, APPLE_SIZE, { r: 0x24, g: 0x24, b: 0x24, alpha: 1 })

	const written = [
		["public/icon-light-32x32.png", lightIcon],
		["public/icon-dark-32x32.png", darkIcon],
		["public/apple-icon.png", appleIcon],
		["app/favicon.ico", toIco(lightIcon, FAVICON_SIZE)],
	]

	for (const [relative, data] of written) {
		await writeFile(join(root, relative), data)
		process.stdout.write(`${relative} (${data.length} bytes)\n`)
	}
}

await main()
