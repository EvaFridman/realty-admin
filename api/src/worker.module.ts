import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module.js";
import { QueueModule } from "./queue/queue.module.js";
import { PdfService } from "./pdf/pdf.service.js";
import { MailService } from "./mail/mail.service.js";
import { MailConsumer } from "./queue/consumers/mail.consumer.js";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, QueueModule],
    providers: [PdfService, MailService, MailConsumer],
})
export class WorkerModule {}