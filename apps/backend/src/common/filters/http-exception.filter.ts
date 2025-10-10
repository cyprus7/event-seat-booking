import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { inspect } from 'util'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name)

    private safeInspect(obj: unknown): string {
        try {
            return inspect(obj, { depth: 6, breakLength: Infinity })
        } catch {
            try {
                return JSON.stringify(obj)
            } catch {
                return String(obj)
            }
        }
    }

    private scrubHeaders(headers: Record<string, unknown>): Record<string, unknown> {
        const cloned: Record<string, unknown> = { ...headers }
        const sensitive = ['authorization', 'cookie', 'set-cookie']
        for (const key of sensitive) {
            for (const h in cloned) {
                if (h.toLowerCase() === key && cloned[h]) {
                    cloned[h] = '[REDACTED]'
                }
            }
        }
        return cloned
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const req = ctx.getRequest<
            Request & {
                body?: Record<string, unknown>
                params?: Record<string, string>
                query?: Record<string, unknown>
            }
        >()
        const res = ctx.getResponse<Response>()

        const isHttpException = exception instanceof HttpException
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const responseObj = isHttpException
            ? exception.getResponse()
            : { message: (exception as { message?: string })?.message ?? String(exception) }

        // Build structured log payload
        const logPayload: Record<string, unknown> = {
            method: req.method,
            url: req.url,
            status,
            response: responseObj,
        }

        // attach useful request context if present
        try {
            logPayload.headers = this.scrubHeaders(
                (req.headers as unknown as Record<string, unknown>) || {},
            )
            if (req.params && Object.keys(req.params).length) logPayload.params = req.params
            if (req.query && Object.keys(req.query).length) logPayload.query = req.query
            if (req.body && Object.keys(req.body).length) logPayload.body = req.body
        } catch {
            // ignore
        }

        // Exception specifics
        let exceptionDetails = ''
        if (exception instanceof Error) {
            exceptionDetails = `${exception.message}\n${exception.stack}`
        } else {
            exceptionDetails = this.safeInspect(exception)
        }

        // Log as error with readable payload and stack/details
        try {
            this.logger.error(
                `HTTP exception: ${req.method} ${req.url} -> status=${status} response=${this.safeInspect(
                    responseObj,
                )}`,
                exception instanceof Error ? exception.stack : this.safeInspect(exception),
            )
            // Also log structured debug info for easier searching
            this.logger.debug(`Request/Response payload:\n${this.safeInspect(logPayload)}`)
            // Log exception details separately (helps CI logs)
            this.logger.debug(`Exception details:\n${exceptionDetails}`)
        } catch (logErr) {
            // Ensure logging failure doesn't crash the app
            this.logger.error('Failed to emit structured exception logs', this.safeInspect(logErr))
        }

        // Re-emit the original response to client
        if (isHttpException) {
            res.status(status).json(responseObj)
        } else {
            res.status(status).json({ message: 'Internal server error' })
        }
    }
}
