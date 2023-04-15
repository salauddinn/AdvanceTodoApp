import * as sinon from 'sinon';


const mochaHooks = {
  afterEach: (): void => {
    sinon.restore();
  },
};

export { mochaHooks };
