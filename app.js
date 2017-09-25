import * as Config from './config';
import { User, Product } from './models';
import dirWatcherEventEmitter from 'modules/dirwatcher/eventEmitter';
import { DirwatcherEvents } from 'modules/dirwatcher/constants';
import DirWatcher from 'modules/dirwatcher';
import Importer from 'modules/importer';

const user = new User();
const product = new Product();
const dirWatcher = new DirWatcher();
const importer = new Importer();

console.log(Config.name);
dirWatcher.watch(Config.dataPath, 2000);
importer.subscribeToEvent(dirWatcherEventEmitter, DirwatcherEvents.CHANGE, { isSync: false });
