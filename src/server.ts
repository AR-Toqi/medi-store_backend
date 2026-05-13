import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;
async function main(){
    try {
        await prisma.$connect();

        app.listen(PORT, () => {
        })
    } catch (error) {
        
    }
};

main();