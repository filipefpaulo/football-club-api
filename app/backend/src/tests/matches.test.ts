import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import { matchBody, matchesMock, updateMatchBody } from './mocks/matches.mock';

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
  it('getAllMatches <fail>', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves([]);
    chaiHttpResponse = await chai.request(app).get('/matches');
    (MatchesModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body.message).to.be.equal('No matches found');
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

    expect(chaiHttpResponse.status).to.be.equal(201);
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
  it('createMatch - <homeTeam = awaiTeam>', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches?inProgress=false')
      .send(matchBody.withSameTeams);

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'It is not possible to create a match with two equal teams',
    );
  });
  it('createMatch - Invalid <team>', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves([]);
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches?inProgress=false')
      .send(matchBody.withInvalidTeam);
    (MatchesModel.findAll as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body.message).to.be.equal(
      'There is no team with such id!',
    );
  });
  it('updateMatch', async () => {
    sinon.stub(MatchesModel, 'update').resolves('ok' as any);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send(updateMatchBody.ok);
    (MatchesModel.update as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.equal('Partida atualizada');
  });

  it('finishMatch', async () => {
    sinon.stub(MatchesModel, 'update').resolves('ok' as any);
    chaiHttpResponse = await chai.request(app).patch('/matches/1/finish');
    (MatchesModel.update as sinon.SinonStub).restore();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body.message).to.be.equal('Finished');
  });
});
