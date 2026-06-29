const fs = require("fs");

async function main() {
    const response = await fetch("https://pennydb.net/api/");

    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();

    let total = 0;
    let misiones = [];

    for (const [zona, lista] of Object.entries(data.missions || {})) {

        for (const mission of lista) {

            const rewards = [
                ...(mission.rewards || []),
                ...(mission.alertRewards || [])
            ];

            for (const reward of rewards) {

                const name = (reward.name || "").toLowerCase();
                const type = (reward.itemType || "").toLowerCase();

                const esVBuck =
                    name.includes("v-buck") ||
                    name.includes("vbuck") ||
                    name.includes("v bucks") ||
                    type.includes("currency_mtx") ||
                    type.includes("mtx");

                if (esVBuck) {

                    const cantidad = reward.quantity || 1;

                    total += cantidad;

                    misiones.push({
                        zona,
                        cantidad,
                        nombre: mission.name || "Sin nombre",
                        powerLevel: mission.powerLevel || mission.pl || null
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
            missions: misiones
        }, null, 2)
    );

    console.log("V-Bucks encontrados:", total);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
