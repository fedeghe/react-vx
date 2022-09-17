/**
 * @jest-environment jsdom
 */
 import reducerFactory, {ACTION_TYPES} from '../source/RVX/reducer'
 import zeroConfig from './configs/zero'

 import {
     WIDTH, HEIGHT, ITEM_WIDTH, ITEM_HEIGHT,
     DEBOUNCE_SCROLLING, DEBOUNCE_FILTERING,
 }  from '../source/RVX/constants'
 
 
 
 describe('reducer - basic', function () {
     const { init } = reducerFactory();
 
     it('initialise as expected - basic defaulted initialization', () => {
        const state = init(zeroConfig);
        expect(state.settings).toMatchObject({
            trackTimes: false,
            warning: 0,
            gap: 3,
            mode: 'table',
        });
        expect(state.settings.debounceTimes).toMatchObject({
            scrolling: 50,
            filtering: 50,
        });
        expect(state.headers.length).toBe(3);
     });
 
 });