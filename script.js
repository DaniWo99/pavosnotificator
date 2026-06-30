const fs = require("fs");

async function main() {
    const response = await fetch("https://pennydb.net/api");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Solo para depuración
    fs.writeFileSync("api.json", JSON.stringify(data, null, 2));

    let total = 0;
    let texto = "";
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

                    total += amount;

                    const zonaBonita = {
                        stonewood: "🌲 Stonewood",
                        plankerton: "🌿 Plankerton",
                        canny: "🏜️ Canny Valley",
                        twine: "⚡ Twine Peaks",
                        ventures: "🚀 Ventures"
                    }[zone] || zone;

                    missions.push({
                        zone: zonaBonita,
                        pl: mission.pl,
                        mission: mission.missionType?.name || "Unknown",
                        amount
                    });

                    console.log(
                        `${amount} - ${zonaBonita} PL${mission.pl} - ${mission.missionType?.name}`
                    );
                }
            }
        }
    }

    if (total === 0) {

        // Si no hay V-Bucks, el archivo contendrá únicamente un 0
        texto = "0";

    } else {

        texto = `🚨 ${total} V-Bucks disponibles\n\n`;

        for (const m of missions) {

            texto += `${m.zone} • PL${m.pl}\n`;
            texto += `⚔️ ${m.mission}\n`;
            texto += `💰 ${m.amount} V-Bucks\n\n`;

        }

        // Quitamos la línea de "Actualizado"
        texto = texto.trimEnd();
    }

    fs.writeFileSync("vbucks.txt", texto);

    fs.writeFileSync(
        "status.json",
        JSON.stringify({
            total,
            updated: new Date().toISOString(),
            missions
        }, null, 2)
    );

    console.log("\n==========================");
    console.log(texto);
    console.log("==========================");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
