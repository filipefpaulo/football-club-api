import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import { matchBody, matchesMock } from './mocks/matches.mock';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('/matches', () => {
  it('getAllMatches', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock as any);
    chaiHttpResponse = await chai.request(app).get('/matches');
    (MatchesModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesMock);
  });
  it('getAllMatches <inProgress = true>', async () => {
    const matchesMockProgressTrue = matchesMock.filter(
      (match) => match.inProgress === true,
    );

    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(matchesMockProgressTrue as any);
    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');
    (MatchesModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesMockProgressTrue);
  });
  it('getAllMatches <inProgress = false>', async () => {
    const matchesMockProgressFalse = matchesMock.filter(
      (match) => match.inProgress === false,
    );

    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(matchesMockProgressFalse as any);
    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');
    (MatchesModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesMockProgressFalse);
  });

  it('createMatch', async () => {
    const matchResult = { id: 666, ...matchBody.OK };

    sinon.stub(MatchesModel, 'create').resolves(matchResult as any);
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches?inProgress=false')
      .send(matchBody.OK);
    (MatchesModel.create as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchResult);
  });
  it('createMatch - Undefined <team>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches?inProgress=false')
      .send(matchBody.withoutHomeTeam);

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body.message).to.be.equal('Teams ids is required');
  });
  it('createMatch - <inProgress = false>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches?inProgress=false')
      .send(matchBody.withFalseInProgress);

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid progress');
  });
});
