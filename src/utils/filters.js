// @flow
import { List, Map, fromJS } from 'immutable';
import moment from 'moment';

import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE } from '../config/constants';
import type { filtersType } from '../components/filters';

export function validateFilters(filters: filtersType): boolean {
  var test = function() {
    if (!Map.isMap(filters)) return false;
    let valid = true;
    filters.forEach((v, k) => {
      if (!List.isList(v)) {
        // check for list
        valid = false;
      } else {
        v.forEach(vv => {
          if (!(Map.isMap(vv) && vv.has('label') && vv.has('value'))) {
            valid = false;
          }
          if (!Map.isMap(vv)) {
            valid = false;
          }
        });
      }
    });
    return valid;
  };
  if (!test()) {
    throw new Error('The filters that you applied were not correct.');
  } else {
    return true;
  }
}

export function getDefaultFromDate(): filtersType {
  const defaultDate = moment()
    .subtract(DEFAULT_FROM_DATE, 'days')
    .format('YYYY-MM-DD');
  return fromJS({
    date__gte: [
      {
        label: defaultDate,
        value: defaultDate
      }
    ]
  });
}

export function getDefaultToDate(): filtersType {
  const defaultDate = moment()
    .subtract(DEFAULT_TO_DATE, 'minutes')
    .utc()
    .format('YYYY-MM-DD HH:mm');
  return fromJS({
    date__lte: [
      {
        label: '',
        value: defaultDate
      }
    ]
  });
}

export function appendDefaultDate(filters: filtersType) {
  if (filters && !filters.has('date__gte') && !filters.has('date__lte')) {
    filters = filters.merge(getDefaultFromDate());
  }
  if (filters && !filters.has('date__lte')) {
    filters = filters.merge(getDefaultToDate());
  }
  return filters;
}
