import fs from 'fs';
import path from 'path';
import { dataPath } from 'config';
import parseCSVSSync from 'csv-parse/lib/sync';
import parse from 'csv-parse';

export default class Importer {

    subscribeToEvent(emitter, eventName, options = { isSync: false }) {
        if (options.isSync) {
            emitter.on(eventName, this.importSync.bind(this));
        } else {
            emitter.on(eventName, this.import.bind(this));
        }
    }

    import(fileName) {
        return new Promise((resolve, reject) => {
            const importedData = [];
            const fullPath = path.join(dataPath, fileName);
            const parser = parse({ delimiter: ',', columns: true });
            let record;

            parser.on('error', reject);
            parser.on('finish', () => resolve(importedData));
            parser.on('readable', () => {
                record = parser.read();

                while (record) {
                    importedData.push(record);
                    record = parser.read();
                }
            });

            fs.createReadStream(fullPath).pipe(parser);
        });
    }

    importSync(fileName) {
        const fullPath = path.join(dataPath, fileName);
        const fileContent = fs.readFileSync(fullPath, { encoding: 'utf8' });
        const importedData = parseCSVSSync(fileContent, { columns: true });

        return importedData;
    }
}
