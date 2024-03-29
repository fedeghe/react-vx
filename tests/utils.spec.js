import each from 'jest-each';
import {
    isFunction,
    debounce,
    escapeComma,
    removeID,
    asXsv,
    asJson,
    getErrorMessage,
    getWarnMessage,
    getTimeSpentMessage,
    paramsMessage,
    trakTime,
    doWarn, mayWarnIf,
    doThrow, throwIf,
    uniqueID
} from '../source/RVX/utils';

describe('utils functions', function () {
    let info, warn,
        spyInfo, spyWarn;
    beforeEach(() => jest.useFakeTimers("modern"));

    afterEach(() => jest.useRealTimers());

    // mute console info
    beforeAll(() => {
        info = console.info; console.info = jest.fn();
        warn = console.warn; console.warn = jest.fn();
    });
    afterAll(() => {
        console.info = info;
        console.warn = warn;
    });
    beforeEach(() => {
        spyInfo = jest.spyOn(console, 'info');
        spyWarn = jest.spyOn(console, 'warn');
    });
    afterEach(jest.restoreAllMocks);
    
    it('isFunction', () => {
        const funcs = [
                () => { },
                function s() { },
                function () { }
            ],
            unfuncs = [
                1,
                true,
                'hello',
                Symbol('hi'),
                null,
            ];
        funcs.forEach(f => expect(isFunction(f)).toBeTruthy());
        unfuncs.forEach(f => expect(isFunction(f)).toBeFalsy());
    });

    it('debounce works as expected', () => {
        let y = 0;
        const r = debounce(v => { y = v;}, 200);
        r(10);
        expect(y).toBe(0);
        r(20);
        expect(y).toBe(0);
        jest.advanceTimersByTime(100);
        expect(y).toBe(0);
        jest.advanceTimersByTime(200);
        expect(y).toBe(20);
    });

    it('removeID works as expected', () => {
        const e = [
            {id:1, name:'Federico'},
            {id:2, name:'Corrado'}
        ];
        expect(removeID(e, 'id')).toMatchObject([{name:'Federico'},{name:'Corrado'}]);
    });

    it('asXsv works as expected', () => {
        const e = [
            {id:1, name:'Federico', surname: 'Ghedina', _ID: 321423},
            {id:2, name:'Corrado', surname: 'Crepo', _ID: 545632}
        ];
        expect(asXsv([{key:'id'}, {key: 'surname'}], e, '_ID', '|')).toBe(`id|surname\n1|Ghedina\n2|Crepo`);
        expect(asXsv([{key:'name'},{key:'id'}, {key: 'surname'}], e, '_ID', '|')).toBe(`name|id|surname\nFederico|1|Ghedina\nCorrado|2|Crepo`);
        expect(asXsv([{key:'id'}, {key: 'surname'},{key:'name'}], e, '_ID', '|')).toBe(`id|surname|name\n1|Ghedina|Federico\n2|Crepo|Corrado`);
    });

    it('asJson works as expected', () => {
        const e = [
            {id:1, name:'Federico'},
            {id:2, name:'Corrado'}
        ];
        // rem asJson by default expect a second param to be the id (rvxID) that is always removed
        expect(asJson(e, 'id')).toMatchObject([{name:'Federico'},{name:'Corrado'}]);
    });

    it('trakTime works as expected', () => {
        const opts = {lib:'mylib'},
            params = {what: 'methodX', time: 123};
        trakTime({...params, opts});
        expect(spyInfo).toHaveBeenLastCalledWith(
            ...getTimeSpentMessage({params, opts})
        );
    });

    it('doWarn - warning active/inactive works as expected', () => {
        doWarn({message: 'watch out', opts: {lib:'mylib', warning: true}});
        expect(spyWarn).toHaveBeenLastCalledWith("MYLIB 🙉 watch out");
        expect(spyWarn).toBeCalledTimes(1);
    
        doWarn({message: 'watch in', opts: {lib:'mylib'}});
        expect(spyWarn).toHaveBeenLastCalledWith("MYLIB 🙉 watch out");
    });

    it('doThrow works as expected', () => {
        try {
            doThrow({message: 'throwing error', opts: {lib:'mylib'}});
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e).toBe('MYLIB 🚨 throwing error');
        }
    });

    it('mayWarnIf - warning active/inactive works as expected', () => {
        mayWarnIf({condition: true, message: 'watch your back', opts: {lib: 'mylib', warning: true}});
        expect(spyWarn).toHaveBeenLastCalledWith("MYLIB 🙉 watch your back");

        mayWarnIf({condition: true, message: 'watch my back', opts: {lib: 'mylib'}});
        expect(spyWarn).toHaveBeenLastCalledWith("MYLIB 🙉 watch your back");
    });

    it('throwIf - condition true/false works as expected', () => {
        try {
            throwIf({condition: true, message: 'throwing error', opts: {lib:'mylib'}});
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e).toBe('MYLIB 🚨 throwing error');
        }
        try {
            throwIf({condition: false, message: 'throwing error', opts: {lib:'mylib'}});
            expect(true).toBeTruthy();
        } catch (e) {
            expect(true).toBeFalsy();
        }
    });

    it('getErrorMessage works as expected', () => {
        expect(getErrorMessage({ message: 'throwing many errors', opts: {lib:'mylib'}}))
            .toBe('MYLIB 🚨 throwing many errors');
        expect(getErrorMessage({
            message: 'throwing many %what%',
            opts: {lib:'mylib'},
            params: {what: 'errors'}
        })).toBe('MYLIB 🚨 throwing many errors');
    });

    it('getWarnMessage works as expected', () => {
        expect(getWarnMessage({ message: 'warning a lot', opts: {lib:'mylib'}})).toBe('MYLIB 🙉 warning a lot');
        expect(getWarnMessage({
            message: 'warning %howMuch%',
            opts: {lib:'mylib'},
            params: {howMuch: 'a lot'}
        })).toBe('MYLIB 🙉 warning a lot');
    });

    it('paramsMessage works as expected', () => {
        expect(paramsMessage({ message: 'warning a %what%', params: {what:'lot'}})).toBe('warning a lot');
        expect(paramsMessage({ message: 'warning a %what%', params: {nope:'lot'}})).toBe('warning a ');
        expect(paramsMessage({ message: 'warning a %w-1h-at%', params: {nope:'lot'}})).toBe('warning a ');
        expect(paramsMessage({ message: 'set %one%.%one%, set %three%.%two%, set %two%.%three%', params: {one: 1, two: 2, three: '3'}})).toBe('set 1.1, set 3.2, set 2.3');
        expect(paramsMessage({
            message: 'set %one%.%one%, set %three%.%two%, set %donotmatch%',
            params: {one: 1, two: 2, three: '3'},
            leaveUnmatching: true
        })).toBe('set 1.1, set 3.2, set donotmatch');
        expect(paramsMessage({
            message: 'set %one%.%one%, set %three%.%two%, set %donotmatch%',
            params: {one: 1, two: 2, three: '3'},
        })).toBe('set 1.1, set 3.2, set ');
    });

    it('escapeComma works as expected', () => {
        const e = {
            in:[',', ',,', 'a,b,c', '', 'ciao.ciao'],
            out:['\\,', '\\,\\,', 'a\\,b\\,c', '', 'ciao.ciao'],
        };
        e.in.forEach((c, i) => expect(escapeComma(c)).toBe(e.out[i]));
    });

    describe('uniqueID works as expected', () => {
        const r = Array.from({length: 1e3}, () => `${uniqueID}`),
            setR = new Set(r);
        each(r).test('%s has the expected format', e => expect(e).toMatch(/RVX_(\d*)/));
        expect(setR.size).toBe(r.length);
    });

});