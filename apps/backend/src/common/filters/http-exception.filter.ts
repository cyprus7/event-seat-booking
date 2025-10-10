import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const req = ctx.getRequest<Request & { body?: any }>()
        const res = ctx.getResponse<Response>()

        const isHttpException = exception instanceof HttpException
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const response = isHttpException
            ? exception.getResponse()
            : { message: 'Internal server error' }

        // Log request metadata + exception response (useful for validation errors)
        try {
            this.logger.error(
                `[${req.method}] ${req.url} -> status=${status} response=${JSON.stringify(response)}`,
                exception instanceof Error ? exception.stack : String(exception),
            )
            // Optionally include request body for easier debugging (beware of sensitive fields)
            if (req.body && Object.keys(req.body).length > 0) {
                this.logger.debug(`Request body: ${JSON.stringify(req.body)}`)
            }
        } catch (err) {
            // Fallback to ensure exception doesn't crash logging
            this.logger.error('Failed to log exception details', err as any)
        }

        // Re-emit the original response to client
        if (isHttpException) {
            res.status(status).json(response)
        } else {
            res.status(status).json({ message: 'Internal server error' })
        }
    }
}
