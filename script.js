const fs = require("fs");

async function main() {

    const response = await fetch("https://pennydb.net/api/");
    const data = await response.json();

    let total = 0;

    for (const zone of Object.values(data.missions || {})) {

        for (const mission of zone) {

            const rewards = [
                ...(mission.rewards || []),
                ...(mission.alertRewards || [])
            ];

            for (const reward of rewards) {

                const name = (reward.name || "").toLowerCase();
                const type = (reward.itemType || "").toLowerCase();

                if (
                    name.includes("v-buck") ||
                    name.includes("vbuck") ||
                    type.includes("currency_mtx")
                ) {
                    total += reward.quantity || 1;
                }

            }

        }

    }

    fs.writeFileSync("vbucks.txt", String(total));

    console.log("V-Bucks:", total);

}

main().catch(console.error);
