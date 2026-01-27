import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;
async function main(){
    try {
       await prisma.$connect();
        console.log("Connected to database");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        
    }
};

main();