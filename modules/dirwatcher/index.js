import fs from 'fs';
import dirEventEmitter from './eventEmitter';
import { DirwatcherEvents } from './constants';

function fsChangeListener(eventType, filename) {
    console.log('DirWatcher -> fsChangeListener', 'event', eventType, filename);

    switch (eventType) {
        case 'change':
            dirEventEmitter.emit(DirwatcherEvents.CHANGE, filename);
            break;
    }
}

export default class DirWatcher {

    /**
     * @param  {String} path
     * @param  {Number} delay watch start dalay - MS
     */
    watch(path, delay) {
        const watchConfig = {
            persistent: true,
            recursive: true,
        }

        setTimeout(() => fs.watch(path, watchConfig, fsChangeListener), delay);
    }
}
