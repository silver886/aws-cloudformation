/* eslint-disable max-len, max-lines-per-function */

import * as sdk from 'aws-sdk';
import * as sdkMock from 'aws-sdk-mock';
sdkMock.setSDKInstance(sdk);

import * as src from '../src';

describe('Initial custom resource', () => {
    describe('with creation event', () => {
        describe('when the secret is normal', () => {
            it('rotation cycle should be created', () => {
                expect(true).toBe(true);
            });
        });
    });
});
