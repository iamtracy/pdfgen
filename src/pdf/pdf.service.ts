import { GeneratePdf } from './pdf.model';
import { pdfImage } from './pdf.image';
import { Pdf } from './pdf.model';
declare var require: any;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class PdfGenService implements GeneratePdf {

    pdf:  Pdf;
    total: number;

    generatePdf(pdf:  Pdf, total: number): string {
        this.pdf = pdf;
        this.total = total;
        return this.create();
    }

    private buildTableBody(data: any, columns: any) {

        let body: Array<any> = [];

        this.pdf.pdfData.push({ payIn: this.total, billRate: 'Payment Due' });

        body.push([
        { text: 'Freelancer', fillColor: '#d4dbde', color: '#155f7b' },
        { text: 'Project', fillColor: '#d4dbde', color: '#155f7b' },
        { text: 'Quantity', fillColor: '#d4dbde', color: '#155f7b' },
        { text: 'Rate', fillColor: '#d4dbde', color: '#155f7b' },
        { text: 'Total', fillColor: '#d4dbde', color: '#155f7b' },
        ]);

        data.forEach(function(row: any, index: number) {

            let dataRow: Array<any> = [];

            if (row.freelancerName == undefined && row.firstName != undefined && row.lastName != undefined) {
                row.freelancerName = row.firstName + ' ' + row.lastName + (row.service == null ? '' : '\nService:' + row.service);
            }

            if (row.hours != undefined) {
                row.hours = parseFloat(row.hours).toFixed(2);
            } else {
                row.hours = '';
            }

            // reset to 1 for legacy situations
            if (row.billRateType == 2 && row.payoutRateType == 1 ) {
                row.hours = '1';
            }

            if (row.payIn != NaN) {
                row.payIn = parseFloat(row.payIn).toFixed(2);
            }

            columns.forEach((column: any, index: number) => {

                if (row[column] == null) {
                    row[column] = '';
                    dataRow.push({ text: row[column].toString(), margin: [0, 5, 0, 5] });
                } else {
                    dataRow.push({ text: row[column].toString(), margin: [0, 5, 0, 5] });
                }

            });

            body.push(dataRow);
        });
        return body;
    }

    private table(data: any, columns: any) {
        return {
            style: 'invoiceTable',
            table: {
            widths: ['*', '*', 'auto', 'auto', 'auto'],
                headerRows: 1,
                body: this.buildTableBody(data, columns)
            },
            layout: 'noBorders'
        };
    }

    private create(): any {

        var msgString = `You're about to send an invoice to
                        ${this.pdf.clientName ? this.pdf.clientName : "the assigned point of contact"}
                        ${this.pdf.clientEmail}`;

            const date = new Date(new Date().getFullYear(), +this.pdf.search.month, 0).getDate();

            var docDefinition = {
                    content: [{
                            columns: [
                                [{
                                        text: 'INVOICE',
                                        style: 'invoiceTitle',
                                        width: '*'
                                    },
                                    {
                                        stack: [{
                                                columns: [{
                                                        text: 'Invoice #',
                                                        style: 'invoiceSubTitle',
                                                        width: 65
                                                    },
                                                    {
                                                        text: this.pdf.invoiceId,
                                                        style: 'invoiceSubValue',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            {
                                                columns: [{
                                                        text: 'Date Issued',
                                                        style: 'invoiceSubTitle',
                                                        width: 65
                                                    },
                                                    {
                                                        text: `${this.pdf.search.month}/${date}/${this.pdf.search.year}`,
                                                        style: 'invoiceSubValue',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            {
                                                columns: [{
                                                        text: 'Due Date',
                                                        style: 'invoiceSubTitle',
                                                        width: 65
                                                    },
                                                    {
                                                        text: `${this.pdf.search.month}/${date}/${this.pdf.search.year}`,
                                                        style: 'invoiceSubValue',
                                                        width: 100
                                                    }
                                                ]
                                            },
                                            {
                                                columns: [{
                                                        text: 'TERMS',
                                                        style: 'invoiceSubTitle',
                                                        width: 65
                                                    },
                                                    {
                                                        text: 'Due on receipt',
                                                        style: 'invoiceSubValue',
                                                        width: 100
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                {
                                    image: pdfImage,
                                    width: 100
                                }
                            ],
                        },
                        {
                            columns: [{
                                    text: 'Billing From',
                                    style: 'invoiceBillingTitle',

                                },
                                {
                                    text: 'Billing To',
                                    style: 'invoiceBillingTitle',

                                },
                            ]
                        },
                        {
                            columns: [{
                                    text: 'Paro - US \n 1165 N. Clark, Suite 501 ',
                                    style: 'invoiceBillingDetails'
                                },
                                {
                                    text: this.pdf.clientName,
                                    style: 'invoiceBillingDetails'
                                },
                            ]
                        },
                        {
                            columns: [{
                                text: 'Chicago, IL 60610 \n billing@paro.io',
                                style: 'invoiceBillingAddress'
                            }]
                        },
                        '\n\n',
                        this.table(this.pdf.pdfData, ['freelancerName', 'projectName', 'hours', 'billRate', 'payIn']),
                        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.025, lineColor: "#d4dbde" }] },
                        '\n',
                        {
                            alignment: 'left',
                            columns: [{
                                stack: [
                                    '\n',
                                    'You have 7 days to review this invoice and send us any questions/concerns. After 7 days, your preferred payment method on file will then be charged.',
                                ],
                                fontSize: 9
                            }]
                        },
                    ],
                    styles: {
                        invoiceTitle: {
                            fontSize: 16,
                            bold: true,
                            alignment: 'left',
                            margin: [0, 0, 0, 15]
                        },
                        invoiceSubTitle: {
                            fontSize: 11,
                            alignment: 'left'
                        },
                        invoiceSubValue: {
                            fontSize: 11,
                            alignment: 'left'
                        },
                        invoiceBillingTitle: {
                            fontSize: 11,
                            alignment: 'left',
                            margin: [0, 20, 0, 3],
                        },
                        invoiceBillingDetails: {
                            fontSize: 11,
                            alignment: 'left'
                        },
                        invoiceBillingAddressTitle: {
                            margin: [0, 2, 0, 3],
                            bold: true
                        },
                        invoiceBillingAddress: {},
                        itemsHeader: {
                            margin: [0, 5, 0, 5],
                            bold: true
                        },
                        itemTitle: {
                            bold: true,
                        },
                        itemSubTitle: {
                            italics: true,
                            fontSize: 11
                        },
                        itemNumber: {
                            margin: [0, 5, 0, 5],
                            alignment: 'center',
                        },
                        itemTotal: {
                            margin: [0, 5, 0, 5],
                            bold: true,
                            alignment: 'center',
                        },
                        signatureJobTitle: {
                            italics: true,
                            fontSize: 11,
                            alignment: 'center',
                        },
                        invoiceTable: {
                            fontSize: 11
                        },
                        notesTitle: {
                            fontSize: 10,
                            bold: true,
                            margin: [0, 50, 0, 3],
                        },
                        notesText: {
                            fontSize: 10
                        },
                        center: {
                            alignment: 'center',
                        }
                    },
                    defaultStyle: {
                        columnGap: 20,
                        color: '#363636'
                    }
                }
            this.pdf.pdfData = [];
            return docDefinition;
        }

}