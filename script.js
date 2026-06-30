const fs = require("fs");

async function main() {
    const response = await fetch("https://pennydb.net/api");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    fs.writeFileSync("api.json", JSON.stringify(data, null, 2));

    let total = 0;
    let missions = [];

    for (const [zone, zoneMissions] of Object.entries(data.missions || {})) {

        for (const mission of zoneMissions) {

            const rewards = [
                ...(mission.rewards || []),
                ...(mission.alertRewards || [])
            ];

            for (const reward of rewards) {

                const name = (reward.name || "").toLowerCase();

                if (name.includes("v-buck") || name.includes("vbuck")) {

                    const amount = reward.quantity || 0;

                    console.log(
                        `${amount} - ${zone} PL${mission.pl} - ${mission.missionType?.name}`
                    );

                    total += amount;

                    missions.push({
                        zone,
                        pl: mission.pl,
                        mission: mission.missionType?.name,
                        amount
                    });
                }
            }
        }
    }

    fs.writeFileSync("vbucks.txt", String(total));

    fs.writeFileSync(
        "status.json",
        JSON.stringify({
            total,
            updated: new Date().toISOString(),
            missions
        }, null, 2)
    );

    console.log(`TOTAL: ${total}`);
}

main().catch(console.error);
