const { ConfigModule, ConfigService } = require('@nestjs/config');
const { HttpModule, HttpService } = require('@nestjs/axios');
const pdfControllerFactory = require('./infrastructure/controllers/pdf.controller');
const SignPDFUseCase = require('./application/use_cases/sign-pdf.usecase');
const PDFService = require('./domain/services/pdf.service');
const OpenSignService = require('./domain/services/opensign.service');
const PDFRepositoryImpl = require('./infrastructure/repositories/pdf.repository.impl');
const express = require('express');

class AppModule {
  static imports = [
    ConfigModule.forRoot(),
    HttpModule,
  ];

  static providers = [
    SignPDFUseCase,
    {
      provide: 'PDFRepository',
      useClass: PDFRepositoryImpl,
    },
    {
      provide: PDFService,
      useFactory: (configService, httpService, pdfRepository) => new PDFService(configService, httpService, pdfRepository),
      inject: [ConfigService, HttpService, 'PDFRepository'],
    },
    OpenSignService,
  ];

  configureRoutes(app) {
    const configService = new ConfigService();
    const httpService = new HttpService();
    const pdfRepository = new PDFRepositoryImpl();
    const pdfService = new PDFService(configService, httpService, pdfRepository);

    app.use('/pdf', pdfControllerFactory(pdfService));
  }
}

module.exports = AppModule;
