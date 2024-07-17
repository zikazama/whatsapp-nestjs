import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private readonly logger = new Logger(WhatsappService.name);
    private client: Client;

    onModuleInit() {
        this.initializeClient();
    }

    initializeClient() {
        this.client = new Client({
            webVersionCache: {
                type: "remote",
                remotePath:
                    "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
            },
        });

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
            this.logger.log('QR Code generated, scan it with your phone.');
        });

        this.client.on('ready', () => {
            this.logger.log('WhatsApp Client is ready!');
        });

        this.client.on('authenticated', () => {
            this.logger.log('WhatsApp Client authenticated!');
        });

        this.client.on('auth_failure', (message) => {
            this.logger.error('Authentication failed:', message);
        });

        this.client.on('disconnected', (reason) => {
            this.logger.warn('WhatsApp Client disconnected:', reason);
        });

        this.client.initialize();
    }

    async sendMessage(to: string, message: string) {
        if (this.client) {
            await this.client.sendMessage(to, message);
            this.logger.log(`Message sent to ${to}`);
        } else {
            this.logger.error('Client is not initialized');
        }
    }
}
