import { DadosBureauPage } from './app.po';

describe('dados-bureau App', () => {
  let page: DadosBureauPage;

  beforeEach(() => {
    page = new DadosBureauPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
