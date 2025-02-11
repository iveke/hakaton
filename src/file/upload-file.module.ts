import { Module } from '@nestjs/common';
import { UploadService } from './upload-file.service';

@Module({
  providers: [UploadService],
  exports: [UploadService], 
})
export class UploadModule {}