import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users' })
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Return user by ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }
}
