import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import sequelize from '../database/models';

import { Response } from 'superagent';
import {
  awayLeaderboardMock,
  homeLeaderboardMock,
  leaderboardMock,
} from './mocks/leaderboard.mock';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('/leaderboard', () => {
  it('General', async () => {
    sinon.stub(sequelize, 'query').resolves([leaderboardMock] as any);
    chaiHttpResponse = await chai.request(app).get('/leaderboard');
    (sequelize.query as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardMock);
  });

  it('/home', async () => {
    sinon.stub(sequelize, 'query').resolves([homeLeaderboardMock] as any);
    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');
    (sequelize.query as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderboardMock);
  });

  it('/awai', async () => {
    sinon.stub(sequelize, 'query').resolves([awayLeaderboardMock] as any);
    chaiHttpResponse = await chai.request(app).get('/leaderboard/away');
    (sequelize.query as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderboardMock);
  });

  it('/xablau', async () => {
    sinon.stub(sequelize, 'query').resolves([leaderboardMock] as any);
    chaiHttpResponse = await chai.request(app).get('/leaderboard/xablau');
    (sequelize.query as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardMock);
  });
});
