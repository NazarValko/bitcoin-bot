import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { TelegrafArgumentsHost } from "nestjs-telegraf";
import { Context } from "telegraf";

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(TelegrafExceptionFilter.name);

    async catch(exception: Error, host: ArgumentsHost): Promise<void> {
        const telegrafHost = TelegrafArgumentsHost.create(host);
        const ctx = telegrafHost.getContext<Context>();

        this.logger.error(`Handling Telegraf exception: ${exception.message}`, exception.stack);
        
        let errorMessage = `Sorry, an error occurred.`;

        await ctx.replyWithHTML(`<b>Error</b>: ${errorMessage}`);
    }
}