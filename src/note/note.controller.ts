import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Post,
  Delete,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CheckPolicies, GetUser, Roles } from '../auth/decorator';
import { MyJwtGuard, PoliciesGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { InsertNoteDTO } from './dto';
import { UpdateNoteDTO } from './dto/update.note.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import {
  Action,
  AppAbility,
} from 'src/casl/casl-ability.factory/casl-ability.factory';

// @UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  // @UseGuards(PoliciesGuard)
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id') //example: /notes/123
  getNoteById(@Param('id') noteId: number) {
    return this.noteService.getNoteById(noteId);
  }

  @Post()
  // @Roles(Role.Admin, Role.User) //Neu co nhieu hon 1 role thi truyen nhu the nay
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  insertNote(
    @GetUser('id') userId: number,
    @Body() insertNoteDTO: InsertNoteDTO,
  ) {
    return this.noteService.insertNote(userId, insertNoteDTO);
  }

  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number, //validate noteId is "number"
    @Body() updateNoteDTO: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(noteId, updateNoteDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteNoteById(@Query('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteNoteById(noteId);
  }
  //now go back to TEST
}
