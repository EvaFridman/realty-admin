import { Channel } from "amqplib";

export async function setupTopology(channel: Channel) {
    await channel.assertExchange("portal", "topic", { durable: true });

    await channel.assertQueue("mail", { durable: true });
    await channel.bindQueue("mail", "portal", "viewing.#");

    await channel.assertQueue("activity", { durable: true });
    await channel.bindQueue("activity", "portal", "#");
}