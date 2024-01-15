import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';

export const httpsOptions = <HttpsOptions>{
  ca: [readFileSync('/usr/share/certs/ca_with_public_keys.crt')],
  key: readFileSync('/usr/share/certs/api/ca.key'),
  cert: readFileSync('/usr/share/certs/api/ca.crt'),
};
