import { prismaClient } from "db/client";
import type { ServerWebSocket } from "bun";

Bun.serve({
    port: 8081,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string | Buffer) {
            try {
                const newUser  = await prismaClient.user.create({
                    data: {
                        username: Math.random().toString(),
                        password: Math.random().toString()
                    }
                });
                console.log("User  created:", newUser );

                ws.send(JSON.stringify({ status: "success", user: newUser  }));
            } catch (error) {
                console.error("Error creating user:", error);
                ws.send(JSON.stringify({ status: "error", message: "Failed to create user" }));
            }
        },
    },
});