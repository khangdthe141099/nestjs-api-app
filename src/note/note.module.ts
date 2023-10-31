import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
