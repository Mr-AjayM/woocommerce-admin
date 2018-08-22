/**
 * @format
 */

/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { ERROR } from 'store/constants';
import reportStatsReducer from '../reducer';
import { getJsonString } from 'store/util';

describe( 'reportStatsReducer()', () => {
	it( 'returns an empty data object by default', () => {
		const state = reportStatsReducer( undefined, {} );
		expect( state ).toEqual( {} );
	} );

	it( 'returns with received report data', () => {
		const originalState = deepFreeze( {} );
		const query = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'day',
		};
		const report = {
			totals: {
				orders_count: 10,
				num_items_sold: 9,
			},
			interval: [ 0, 1, 2 ],
		};
		const endpoint = 'revenue';

		const state = reportStatsReducer( originalState, {
			type: 'SET_REPORT_STATS',
			endpoint,
			query,
			report,
		} );

		const queryKey = getJsonString( query );
		expect( state[ endpoint ][ queryKey ] ).toEqual( report );
	} );

	it( 'tracks multiple queries per endpoint in report data', () => {
		const otherQuery = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'week',
		};
		const otherQueryKey = getJsonString( otherQuery );
		const otherQueryState = {
			revenue: {
				[ otherQueryKey ]: { totals: 1000 },
			},
		};
		const originalState = deepFreeze( otherQueryState );
		const query = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'day',
		};
		const report = {
			totals: {
				orders_count: 10,
				num_items_sold: 9,
			},
			interval: [ 0, 1, 2 ],
		};
		const endpoint = 'revenue';

		const state = reportStatsReducer( originalState, {
			type: 'SET_REPORT_STATS',
			endpoint,
			query,
			report,
		} );

		const queryKey = getJsonString( query );
		expect( state[ endpoint ][ queryKey ] ).toEqual( report );
		expect( state[ endpoint ][ otherQueryKey ].totals ).toEqual( 1000 );
	} );

	it( 'tracks multiple endpoints in report data', () => {
		const productsQuery = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'week',
		};
		const productsQueryKey = getJsonString( productsQuery );
		const productsQueryState = {
			products: {
				[ productsQueryKey ]: { totals: 1999 },
			},
		};
		const originalState = deepFreeze( productsQueryState );
		const query = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'day',
		};
		const report = {
			totals: {
				orders_count: 10,
				num_items_sold: 9,
			},
			interval: [ 0, 1, 2 ],
		};
		const endpoint = 'revenue';

		const state = reportStatsReducer( originalState, {
			type: 'SET_REPORT_STATS',
			endpoint,
			query,
			report,
		} );

		const queryKey = getJsonString( query );
		expect( state[ endpoint ][ queryKey ] ).toEqual( report );
		expect( state.products[ productsQueryKey ].totals ).toEqual( 1999 );
	} );

	it( 'returns with received error data', () => {
		const originalState = deepFreeze( {} );
		const query = {
			after: '2018-01-04T00:00:00+00:00',
			before: '2018-07-14T00:00:00+00:00',
			interval: 'day',
		};
		const endpoint = 'revenue';

		const state = reportStatsReducer( originalState, {
			type: 'SET_REPORT_STATS_ERROR',
			endpoint,
			query,
		} );

		const queryKey = getJsonString( query );
		expect( state[ endpoint ][ queryKey ] ).toEqual( ERROR );
	} );
} );
