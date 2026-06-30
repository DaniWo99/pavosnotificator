const fs = require("fs");

async function main() {
    console.log("Descargando API...");

    const response = await fetch("https://pennydb.net/api/");

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    // ====== GUARDA LA API COMPLETA ======
    fs.writeFileSync(
        "api.json",
        JSON.stringify(data, null, 2)
    );

    let total = 0;
    let missions = [];

    const zones = data.missions || {};

    for (const [zone, zoneMissions] of Object.entries(zones)) {

        for (const mission of zoneMissions) {

            const rewards = [
                ...(mission.rewards || []),
                ...(mission.alertRewards || [])
            ];

            for (const reward of rewards) {

                const name = (reward.name || "").toLowerCase();

                if (
                    name.includes("v-buck") ||
                    name.includes("vbuck")
                ) {

                    const amount = reward.quantity || 0;

                    total += amount;

                    missions.push({
                        zone,
                        powerLevel: mission.pl,
                        mission: mission.missionType?.name || "Unknown",
                        amount
                    });

                }

            }

        }

    }

    fs.writeFileSync(
        "vbucks.txt",
        String(total)
    );

    fs.writeFileSync(
        "status.json",
        JSON.stringify({
            total,
            updated: new Date().toISOString(),
            missions
        }, null, 2)
    );

    console.log("=================================");
    console.log("V-Bucks:", total);
    console.log("Misiones:", missions.length);
    console.log("=================================");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
