import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';

export const httpsOptions = <HttpsOptions>{
  key: readFileSync('/usr/share/certs/api/privkey1.pem'),
  cert: readFileSync('/usr/share/certs/api/fullchain1.pem'),
};
