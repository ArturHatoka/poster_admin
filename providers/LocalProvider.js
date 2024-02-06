import path from 'path';

import fsExtra from 'fs-extra';
import {LocalProvider} from '@adminjs/upload';
import {UploadedFile} from 'adminjs';

class LocalProvider extends LocalProvider {
    public async upload(file: UploadedFile, key: string): Promise<any> {
        const filePath = process.platform === 'win32' ? this.path(key) : this.path(key).slice(1); // adjusting file path according to OS
        await fsExtra.mkdir(path.dirname(filePath), {recursive: true});
        await fsExtra.move(file.path, filePath, {overwrite: true});
    }
}

export default LocalProvider