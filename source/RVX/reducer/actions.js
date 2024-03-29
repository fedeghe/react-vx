export const CELL_LEAVE = Symbol('table layout: leave a cell'),
    CELL_ENTER = Symbol('table layout: enter a cell'),
    FILTER =  Symbol('apply all filters'),
    INIT = Symbol('initialise'),
    LOADING =  Symbol('loading'),
    SCROLL =  Symbol('scroll'),
    SORT = Symbol('sort per column(table) or group(gri  d)'),
    TOGGLE_COLUMN_VISIBILITY = Symbol('toggle a table column visibility'),
    TOGGLE_GROUP =  Symbol('toggle one group'),
    TOGGLE_GROUPS =  Symbol('toggle all groups'),
    UNFILTER =  Symbol('unfilter global or all'),
    UNFILTER_FIELDS =  Symbol('unfilter all fields or  some'),
    UNSORT = Symbol('unsort column(table) or group(grid)');

// eslint-disable-next-line one-var
export default {
    CELL_ENTER,
    CELL_LEAVE,
    FILTER,
    INIT,
    LOADING,    
    SCROLL,
    SORT,
    TOGGLE_COLUMN_VISIBILITY,
    TOGGLE_GROUP,
    TOGGLE_GROUPS,
    UNFILTER,
    UNFILTER_FIELDS,
    UNSORT,
};