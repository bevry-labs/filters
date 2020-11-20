const fs = require("fs/promises");
const list = require("@bevry/list");
const now = new Date();

const credits = [
	"Sources:",
	"https://github.com/nextdns/piracy-blocklists",
	"https://github.com/djprmf/trackerlist",
	"https://github.com/XIU2/TrackersListCollection",
	"https://github.com/Napoleon-Black/torrents_blocker",
	"https://github.com/wiatagan/Trackers",
	"https://github.com/chenjia404/zeronet-autoseed/blob/master/trackers_all.txt",
	"https://github.com/0xsentinel/CHEF-KOCH/blob/master/Torrent/CK's-Torrent-FilterList.txt",
	"https://github.com/JamesLinus/Torrent-Tracker/blob/master/TorrentTracker.txt",
	"https://github.com/ungdev/ua-lancache/blob/master/dns/trackers_list",
	"https://raw.githubusercontent.com/YUChoe/trackeorg/master/trackers.txt",
	"https://github.com/xavier84/ban-tracker/",
	"https://github.com/BilalAhmedali/trackers/blob/master/trackers.txt",
	"https://github.com/blocklistproject/Lists",
	"https://github.com/XionKzn/PiHole-Lists/tree/master/PiHole/Archive",
]
	.map((i) => `! ${i}`)
	.join("\n");

const meta = [
	"! Title: Sin Filter",
	"! Description: Disables malware/porn/piracy/gambling",
	`! Version: 1.0.${now.getTime()}`,
	"! Expires: 1 hour (update frequency)",
	"! Homepage: https://github.com/balupton/filters",
	"! License: https://unlicense.org",
].join("\n");

async function main() {
	const data = await fs.readFile("./filter-sin.txt", "utf-8");

	let entries = list
		// remove duplicates
		.unique(
			data
				.split("\n")
				.map((line) => {
					// trim www, ip, spaces, pathnames, protocol, port, rule formatting
					line = line
						.replace(/^(\s+|www\.|0\.0\.0\.0\s|.+?\/\/|\|+)+/g, "")
						.replace(/(\/.+|\^)$/g, "")
						.replace(/\d*:\d*/g, "");
					// trim comment
					if (["#", "!", "*", "-"].includes(line[0])) return "";
					// trim unknown
					if (line.includes(" ")) return "";
					// lowercase
					line = line.toLowerCase();
					// trim things that became only TLDs
					if (line.includes(".") === false) return "";
					// trim false positives
					if (
						[
							// == safe domains ==
							"github.com",
							"raw.githubusercontent.com",
							"adguard.com",
							"primevideo.com",
							// == safe certificate providers ==
							"ocsp.digicert.com",
							// == safe ip addresses ==
							// github.io / kryptco.github.io
							"185.199.111.153",
						].includes(line)
					)
						return "";
					// return
					return line;
				})
				// trim empty
				.filter((i) => i)
				// add format
				.map((i) => `||${i}^`)
		)
		// sort
		.sort()
		// join
		.join("\n");

	// add header
	const result = `${meta}\n\n${credits}\n\n${entries}`;

	// write
	await fs.writeFile("./filter-sin.txt", result);
}

main()
	.then(() => console.log("all done"))
	.catch((err) => {
		throw err;
	});
