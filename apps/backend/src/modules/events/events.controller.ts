import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { EventsService } from './events.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'Event created successfully' })
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all events' })
    @ApiResponse({ status: 200, description: 'Return all events' })
    findAll() {
        return this.eventsService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event by ID' })
    @ApiResponse({ status: 200, description: 'Return event by ID' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.findOne(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event' })
    @ApiResponse({ status: 200, description: 'Event updated successfully' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
        return this.eventsService.update(id, updateEventDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete event' })
    @ApiResponse({ status: 204, description: 'Event deleted successfully' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.remove(id)
    }
}
